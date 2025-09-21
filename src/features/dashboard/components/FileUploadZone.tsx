import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

import Button from '@/shared/components/forms/Button';
import { useFileUpload } from '@/shared/hooks/api/useUploads';
import { useSubmitParseJob } from '@/shared/hooks/api/useJobs';
import { getErrorMessage } from '@/lib/api';

interface FileUploadZoneProps {
  onJobSubmitted?: (jobId: string) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onJobSubmitted }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null);
  
  const { uploadFile, uploadProgress, isUploading, reset } = useFileUpload();
  const { submitParseJob, isPending: isSubmittingJob } = useSubmitParseJob();

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    try {
      const documentId = await uploadFile(file);
      setUploadedDocumentId(documentId);
    } catch (error) {
      // Error is handled by the upload hook
    }
  }, [uploadFile]);

  const handleSubmitJob = useCallback(async () => {
    if (!uploadedDocumentId) return;
    
    try {
      await submitParseJob(uploadedDocumentId);
      onJobSubmitted?.(uploadedDocumentId);
      reset();
      setUploadedDocumentId(null);
    } catch (error) {
      // Error handled by mutation
    }
  }, [uploadedDocumentId, submitParseJob, onJobSubmitted, reset]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
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
    handleFiles(e.target.files);
  }, [handleFiles]);

  const handleReset = useCallback(() => {
    reset();
    setUploadedDocumentId(null);
  }, [reset]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8"
    >
      {/* Upload Progress */}
      {isUploading && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {uploadProgress.phase === 'signing' && 'Preparing upload...'}
            {uploadProgress.phase === 'uploading' && 'Uploading file...'}
            {uploadProgress.phase === 'completing' && 'Finalizing...'}
          </h3>
          
          <div className="w-full max-w-xs mx-auto mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{uploadProgress.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {uploadProgress.bytesUploaded && uploadProgress.totalBytes && (
            <p className="text-sm text-gray-500">
              {(uploadProgress.bytesUploaded / 1024 / 1024).toFixed(1)} MB of{' '}
              {(uploadProgress.totalBytes / 1024 / 1024).toFixed(1)} MB
            </p>
          )}
        </div>
      )}

      {/* Upload Error */}
      {uploadProgress.phase === 'error' && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Failed</h3>
          <p className="text-red-600 mb-4">{uploadProgress.error}</p>
          
          <Button variant="outline" onClick={handleReset}>
            Try Again
          </Button>
        </div>
      )}

      {/* Upload Success - Ready to Submit Job */}
      {uploadedDocumentId && uploadProgress.phase === 'completed' && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Complete</h3>
          <p className="text-gray-600 mb-4">Ready to start document processing</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleSubmitJob}
              isLoading={isSubmittingJob}
              leftIcon={<FileText className="w-4 h-4" />}
            >
              Start Processing
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Upload Different File
            </Button>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {!isUploading && !uploadedDocumentId && uploadProgress.phase !== 'error' && (
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
            <Button as="span" className="cursor-pointer">
              Select File
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