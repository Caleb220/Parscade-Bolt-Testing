/**
 * Create Job Dialog Component
 * Modal form for creating new jobs
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Link, Database } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

interface CreateJobDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: JobFormData) => void;
  projects: Array<{ id: string; name: string }>;
  isLoading?: boolean;
}

interface JobFormData {
  name: string;
  type: string;
  projectId: string;
  source: 'upload' | 'url' | 's3';
  sourceData: {
    file?: File;
    url?: string;
    s3Path?: string;
  };
  options: {
    extractText?: boolean;
    generateSummary?: boolean;
    detectLanguage?: boolean;
  };
}

const jobTypes = [
  { value: 'parse', label: 'Parse Document' },
  { value: 'extract', label: 'Extract Data' },
  { value: 'analyze', label: 'Analyze Content' },
  { value: 'convert', label: 'Convert Format' },
];

const CreateJobDialog: React.FC<CreateJobDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projects,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<JobFormData>({
    name: '',
    type: 'parse',
    projectId: '',
    source: 'upload',
    sourceData: {},
    options: {
      extractText: true,
      generateSummary: false,
      detectLanguage: true,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      type: 'parse',
      projectId: '',
      source: 'upload',
      sourceData: {},
      options: {
        extractText: true,
        generateSummary: false,
        detectLanguage: true,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        sourceData: { ...prev.sourceData, file }
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Set up a new document processing job with your preferred settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="job-name">Job Name</Label>
              <Input
                id="job-name"
                placeholder="Enter job name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                fullWidth
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job-type">Job Type</Label>
                <select
                  id="job-type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {jobTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="project">Project</Label>
                <select
                  id="project"
                  value={formData.projectId}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Source Selection */}
          <div className="space-y-4">
            <Label>Source Type</Label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'upload', label: 'File Upload', icon: Upload },
                { value: 'url', label: 'URL', icon: Link },
                { value: 's3', label: 'S3 Path', icon: Database },
              ].map(({ value, label, icon: Icon }) => (
                <motion.button
                  key={value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    source: value as 'upload' | 'url' | 's3',
                    sourceData: {}
                  }))}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                    formData.source === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Source-specific Fields */}
          <div className="space-y-4">
            {formData.source === 'upload' && (
              <div>
                <Label htmlFor="file-upload">Upload File</Label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.txt,.xlsx,.csv"
                  required
                />
              </div>
            )}

            {formData.source === 'url' && (
              <div>
                <Label htmlFor="source-url">Document URL</Label>
                <Input
                  id="source-url"
                  placeholder="https://example.com/document.pdf"
                  value={formData.sourceData.url || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sourceData: { ...prev.sourceData, url: e.target.value }
                  }))}
                  required
                  fullWidth
                />
              </div>
            )}

            {formData.source === 's3' && (
              <div>
                <Label htmlFor="s3-path">S3 Path</Label>
                <Input
                  id="s3-path"
                  placeholder="bucket-name/path/to/document.pdf"
                  value={formData.sourceData.s3Path || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sourceData: { ...prev.sourceData, s3Path: e.target.value }
                  }))}
                  required
                  fullWidth
                />
              </div>
            )}
          </div>

          {/* Processing Options */}
          <div className="space-y-4">
            <Label>Processing Options</Label>
            <div className="space-y-3">
              {[
                { key: 'extractText', label: 'Extract Text Content' },
                { key: 'generateSummary', label: 'Generate Summary' },
                { key: 'detectLanguage', label: 'Detect Language' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.options[key as keyof typeof formData.options]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      options: { ...prev.options, [key]: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              glow
            >
              Create Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(CreateJobDialog);