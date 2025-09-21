import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
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
      className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8"
    >
      {/* Upload Progress */}
      {isUploading && currentPhase !== 'idle' && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentPhase === 'signing' && 'Preparing upload...'}
            {currentPhase === 'uploading' && 'Uploading file...'}
            {currentPhase === 'completing' && 'Finalizing...'}
          </h3>
          
          <div className="w-full max-w-xs mx-auto mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{currentProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {uploadProgress?.bytesUploaded && uploadProgress?.totalBytes && (
            <p className="text-sm text-gray-500">
              {formatBytes(uploadProgress.bytesUploaded)} of {formatBytes(uploadProgress.totalBytes)}
            </p>
          )}
        </div>
      )}

      {/* Upload Error */}
      {currentPhase === 'error' && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Failed</h3>
          <p className="text-red-600 mb-4">{uploadError || 'An error occurred during upload'}</p>
          
          <Button variant="outline" onClick={handleReset}>
            Try Again
          </Button>
        </div>
      )}

      {/* Upload Success - Ready to Submit Job */}
      {uploadedDocumentId && currentPhase === 'completed' && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Complete</h3>
          <p className="text-gray-600 mb-4">Ready to start document processing</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleSubmitJob}
              disabled={submitParseJobMutation?.isPending || false}
            >
              <FileText className="w-4 h-4 mr-2" />
              Start Processing
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Upload Different File
            </Button>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {!isUploading && !uploadedDocumentId && currentPhase !== 'error' && (
        <div
          className={`text-center transition-colors duration-200 ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-gray-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Document
          </h3>
          
          <p className="text-gray-600 mb-4">
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
            <Button asChild className="cursor-pointer">
              <span>
              Select File
              </span>
            </Button>
          </label>
          
          <p className="text-xs text-gray-500 mt-4">
            Supported: PDF, Word, Excel, CSV, Images (max 50MB)
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default FileUploadZone;