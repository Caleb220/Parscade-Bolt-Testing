import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

import CustomButton from '@/shared/components/forms/CustomButton';
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
      <div className={`bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border-2 transition-all duration-300 p-8 shadow-premium ${
        dragActive 
          ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-premium-lg scale-[1.02]' 
          : 'border-dashed border-gray-300 hover:border-gray-400 hover:shadow-premium-lg'
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          {/* Upload Progress */}
          {isUploading && currentPhase !== 'idle' && (
            <div className="text-center">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6 shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Upload className="w-10 h-10 text-blue-600" />
                </motion.div>
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                {currentPhase === 'signing' && 'Preparing upload...'}
                {currentPhase === 'uploading' && 'Uploading file...'}
                {currentPhase === 'completing' && 'Finalizing...'}
              </h3>
              
              <div className="w-full max-w-sm mx-auto mb-6">
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{currentProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${currentProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {uploadProgress?.bytesUploaded && uploadProgress?.totalBytes && (
                <p className="text-sm text-gray-600 font-medium">
                  {formatBytes(uploadProgress.bytesUploaded)} of {formatBytes(uploadProgress.totalBytes)}
                </p>
              )}
            </div>
          )}

          {/* Upload Error */}
          {currentPhase === 'error' && (
            <div className="text-center">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl mb-6 shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="w-10 h-10 text-red-600" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Upload Failed</h3>
              <p className="text-red-600 mb-6 font-medium">{uploadError || 'An error occurred during upload'}</p>
              
              <CustomButton 
                variant="outline" 
                onClick={handleReset}
                className="hover:shadow-sm transition-all duration-200"
              >
                Try Again
              </CustomButton>
            </div>
          )}

          {/* Upload Success - Ready to Submit Job */}
          {uploadedDocumentId && currentPhase === 'completed' && (
            <div className="text-center">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-6 shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Upload Complete</h3>
              <p className="text-gray-600 mb-6 font-medium">Ready to start document processing</p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <CustomButton
                    onClick={handleSubmitJob}
                    disabled={submitParseJobMutation?.isPending || false}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Start Processing
                  </CustomButton>
                </motion.div>
                <CustomButton 
                  variant="outline" 
                  onClick={handleReset}
                  className="hover:shadow-sm transition-all duration-200"
                >
                  Upload Different File
                </CustomButton>
              </div>
            </div>
          )}

          {/* Upload Zone */}
          {!isUploading && !uploadedDocumentId && currentPhase !== 'error' && (
            <div
              className={`text-center transition-all duration-300 ${
                dragActive ? 'scale-105' : ''
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200/50 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="w-10 h-10 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                Upload Document
              </h3>
              
              <p className="text-gray-600 mb-6 font-medium">
                Drop your file here or click to browse
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
                  <CustomButton className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3">
                    Select File
                  </CustomButton>
                </motion.div>
              </label>
              
              <p className="text-xs text-gray-500 mt-4 font-medium">
                Supported: PDF, Word, Excel, CSV, Images (max 50MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FileUploadZone;