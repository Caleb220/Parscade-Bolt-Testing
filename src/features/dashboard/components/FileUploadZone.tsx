import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle, Sparkles, Zap } from 'lucide-react';

import { ParscadeButton, ParscadeCard, ProcessingPipeline } from '@/shared/components/brand';
import { formatBytes } from '@/shared/utils/formatters';
import { useFileUpload } from '@/shared/hooks/api/useUploads';
import { useSubmitParseJob } from '@/shared/hooks/api/useJobs';

interface FileUploadZoneProps {
  onJobSubmitted?: (jobId: string) => void;
}

/**
 * File upload zone with drag & drop support and job submission
 */
const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onJobSubmitted }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null);
  
  const { uploadFile, uploadProgress, isUploading, reset } = useFileUpload();
  const submitParseJobMutation = useSubmitParseJob();

  /**
   * Handle file selection and upload
   */
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || !files.length) return;
    
    const file = files[0];
    if (!file) return;
    
    try {
      const documentId = await uploadFile(file);
      if (documentId) {
        setUploadedDocumentId(documentId);
      }
    } catch (error) {
      // Error handled by upload hook
    }
  }, [uploadFile]);

  /**
   * Submit processing job for uploaded document
   */
  const handleSubmitJob = useCallback(async () => {
    if (!uploadedDocumentId) return;
    
    try {
      const result = await submitParseJobMutation.mutateAsync(uploadedDocumentId);
      if (result?.id) {
        onJobSubmitted?.(result.id);
      } else {
        onJobSubmitted?.(uploadedDocumentId);
      }
      reset();
      setUploadedDocumentId(null);
    } catch (error) {
      // Error handled by mutation
    }
  }, [uploadedDocumentId, submitParseJobMutation, onJobSubmitted, reset]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleReset = useCallback(() => {
    reset();
    setUploadedDocumentId(null);
  }, [reset]);

  const currentPhase = uploadProgress?.phase || 'idle';
  const currentProgress = uploadProgress?.progress || 0;
  const uploadError = uploadProgress?.error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden"
    >
      <ParscadeCard 
        variant={dragActive ? 'glow' : 'gradient'}
        hover={!isUploading}
        className={`border-2 transition-all duration-300 p-8 ${
        dragActive 
          ? 'border-purple-400 scale-[1.02]' 
          : 'border-dashed border-purple-300/50 hover:border-purple-400'
      }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        
          {/* Upload Progress */}
          {isUploading && currentPhase !== 'idle' && (
            <div className="text-center">
              <div className="mb-6">
                <ProcessingPipeline 
                  currentStep={
                    currentPhase === 'signing' ? 0 :
                    currentPhase === 'uploading' ? 1 :
                    currentPhase === 'completing' ? 2 : 3
                  }
                  animated
                />
              </div>
              
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-2xl mb-6 shadow-parscade"
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 8px 32px rgba(124, 109, 242, 0.2)',
                    '0 12px 48px rgba(124, 109, 242, 0.4)',
                    '0 8px 32px rgba(124, 109, 242, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-10 h-10 text-purple-600" />
                </motion.div>
              </motion.div>
              
              <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">
                {currentPhase === 'signing' && 'Preparing upload...'}
                {currentPhase === 'uploading' && 'Uploading file...'}
                {currentPhase === 'completing' && 'Finalizing...'}
              </h3>
              
              <div className="w-full max-w-sm mx-auto mb-6">
                <div className="flex justify-between text-sm font-bold text-purple-700 mb-2">
                  <span>Progress</span>
                  <span>{currentProgress}%</span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-3 shadow-inner">
                  <motion.div
                    className="bg-gradient-to-r from-purple-600 to-cyan-500 h-3 rounded-full shadow-parscade"
                    initial={{ width: 0 }}
                    animate={{ width: `${currentProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {uploadProgress?.bytesUploaded && uploadProgress?.totalBytes && (
                <p className="text-sm text-purple-600 font-bold">
                  {formatBytes(uploadProgress.bytesUploaded)} of {formatBytes(uploadProgress.totalBytes)}
                </p>
              )}
            </div>
          )}

          {/* Upload Error */}
          {currentPhase === 'error' && (
            <div className="text-center">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl mb-6 shadow-parscade"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="w-10 h-10 text-red-600" />
              </motion.div>
              
              <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">Upload Failed</h3>
              <p className="text-red-600 mb-6 font-bold">{uploadError || 'An error occurred during upload'}</p>
              
              <ParscadeButton 
                variant="outline" 
                onClick={handleReset}
              >
                Try Again
              </ParscadeButton>
            </div>
          )}

          {/* Upload Success - Ready to Submit Job */}
          {uploadedDocumentId && currentPhase === 'completed' && (
            <div className="text-center">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-6 shadow-parscade"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className="w-10 h-10 text-green-600" />
                </motion.div>
              </motion.div>
              
              <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">Ready to Transform</h3>
              <p className="text-purple-600 mb-6 font-bold">Your document is ready for intelligent processing</p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <ParscadeButton
                    variant="primary"
                    onClick={handleSubmitJob}
                    disabled={submitParseJobMutation?.isPending || false}
                    glow
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Transform Document
                  </ParscadeButton>
                </motion.div>
                <ParscadeButton 
                  variant="outline" 
                  onClick={handleReset}
                >
                  Upload Different File
                </ParscadeButton>
              </div>
            </div>
          )}

          {/* Upload Zone */}
          {!isUploading && !uploadedDocumentId && currentPhase !== 'error' && (
            <div
              className={`text-center transition-all duration-300 ${
                dragActive ? 'scale-105' : ''
              }`}
            >
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-2xl mb-6 shadow-parscade group-hover:shadow-parscade-lg transition-all duration-300"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5,
                  boxShadow: '0 0 32px rgba(124, 109, 242, 0.4)'
                }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="w-10 h-10 text-purple-600 group-hover:text-cyan-500 transition-colors duration-300" />
              </motion.div>
              
              <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">
                Transform Your Documents
              </h3>
              
              <p className="text-purple-600 mb-6 font-bold">
                Drop files here to begin the transformation journey
              </p>
              
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleInputChange}
                accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.jpg,.jpeg,.png"
              />
              
              <label htmlFor="file-upload">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ParscadeButton variant="primary" glow className="cursor-pointer px-8 py-3">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Choose Document
                  </ParscadeButton>
                </motion.div>
              </label>
              
              <p className="text-xs text-purple-500 mt-4 font-bold">
                Supported: PDF, Word, Excel, CSV, Images (max 50MB)
              </p>
            </div>
          )}
      </ParscadeCard>
    </motion.div>
  );
};

export default FileUploadZone;