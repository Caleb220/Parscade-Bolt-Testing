/**
 * File Upload Zone - Refined Parscade Theme
 * Professional upload interface with transformation metaphors
 */

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle, Zap, ArrowRight } from 'lucide-react';

import { ParscadeButton, ParscadeCard } from '@/shared/components/brand';
import { formatBytes } from '@/shared/utils/formatters';
import { useUploadDocument } from '@/shared/hooks/api/useDocuments';
import { useSubmitParseJob } from '@/shared/hooks/api/useJobs';

interface FileUploadZoneProps {
  onJobSubmitted?: (jobId: string) => void;
}

/**
 * Professional file upload zone with transformation workflow
 */
const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onJobSubmitted }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<'idle' | 'uploading' | 'completed' | 'error'>('idle');
  
  const uploadDocument = useUploadDocument();
  const submitParseJobMutation = useSubmitParseJob();

  /**
   * Handle file selection and upload
   */
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || !files.length) return;
    
    const file = files[0];
    if (!file) return;
    
    setUploadPhase('uploading');
    setUploadProgress(0);
    
    try {
      const response = await uploadDocument.mutateAsync({
        file,
        metadata: { uploadedAt: new Date().toISOString() },
      });
      
      setUploadPhase('completed');
      setUploadProgress(100);
      
      // Automatically start processing job
      if (response.document.id) {
        try {
          const job = await submitParseJobMutation.mutateAsync({ 
            documentId: response.document.id,
          });
          if (job?.id) {
            onJobSubmitted?.(job.id);
          } else {
            onJobSubmitted?.(response.document.id);
          }
        } catch (jobError) {
          // Job creation failed, but upload succeeded
          console.warn('Failed to create processing job:', jobError);
          onJobSubmitted?.(response.document.id);
        }
      }
      
      // Reset after delay
      setTimeout(() => {
        setUploadPhase('idle');
        setUploadProgress(0);
      }, 2000);
      
    } catch (error) {
      setUploadPhase('error');
      // Error handled by mutation
    }

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
    setUploadPhase('idle');
    setUploadProgress(0);
  }, []);

  const isUploading = uploadDocument.isPending || uploadPhase === 'uploading';
  const uploadError = uploadDocument.error;

  return (
    <ParscadeCard 
      variant={dragActive ? 'gradient' : 'default'}
      hover={!isUploading}
      className={`border-2 transition-all duration-300 p-6 ${
        dragActive 
          ? 'border-blue-400 scale-[1.01]' 
          : 'border-dashed border-slate-300 hover:border-blue-300'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden"
      >
        {/* Upload Progress */}
        {isUploading && uploadPhase !== 'idle' && (
          <div className="text-center">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-6 shadow-parscade"
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 4px 20px rgba(14, 165, 233, 0.1)',
                  '0 8px 32px rgba(14, 165, 233, 0.2)',
                  '0 4px 20px rgba(14, 165, 233, 0.1)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-8 h-8 text-blue-600" />
              </motion.div>
            </motion.div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {uploadPhase === 'uploading' && 'Uploading document...'}
            </h3>
            
            <div className="w-full max-w-sm mx-auto mb-6">
              <div className="flex justify-between text-sm font-medium text-blue-700 mb-2">
                <span>Progress</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2 shadow-inner">
                <motion.div
                  className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Upload Error */}
        {uploadPhase === 'error' && (
          <div className="text-center">
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-xl mb-6 shadow-parscade"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="w-8 h-8 text-red-600" />
            </motion.div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Failed</h3>
            <p className="text-red-600 mb-6">{uploadError ? getErrorMessage(uploadError) : 'An error occurred during upload'}</p>
            
            <ParscadeButton 
              variant="outline" 
              onClick={handleReset}
            >
              Try Again
            </ParscadeButton>
          </div>
        )}

        {/* Upload Success - Ready to Submit Job */}
        {uploadPhase === 'completed' && (
          <div className="text-center">
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl mb-6 shadow-parscade"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </motion.div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Complete</h3>
            <p className="text-blue-600 mb-6">Document uploaded and processing job started automatically</p>
            
            <ParscadeButton 
              variant="outline" 
              onClick={handleReset}
            >
              Upload Another File
            </ParscadeButton>
          </div>
        )}

        {/* Upload Zone */}
        {!isUploading && uploadPhase === 'idle' && (
          <div
            className={`text-center transition-all duration-300 py-12 ${
              dragActive ? 'scale-105' : ''
            }`}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-6 shadow-parscade group-hover:shadow-parscade-lg transition-all duration-300"
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 24px rgba(14, 165, 233, 0.3)'
              }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="w-8 h-8 text-blue-600" />
            </motion.div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Upload Documents
            </h3>
            
            <p className="text-slate-600 mb-6">
              Drop files here or click to browse
            </p>
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleInputChange}
              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.jpg,.jpeg,.png"
            />
            
            <label htmlFor="file-upload">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <ParscadeButton variant="primary" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </ParscadeButton>
              </motion.div>
            </label>
            
            <p className="text-xs text-slate-500 mt-4">
              Supported: PDF, Word, Excel, CSV, Images (max 50MB)
            </p>
          </div>
        )}
      </motion.div>
    </ParscadeCard>
  );
};

export default FileUploadZone;