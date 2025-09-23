import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { dataSourceSchema, type DataSourceFormData } from '@/lib/validation/account';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { useCreateDataSource } from '@/shared/hooks/api/useAccountData';

interface CreateDataSourceDialogProps {
  onSuccess: () => void;
}

const CreateDataSourceDialog: React.FC<CreateDataSourceDialogProps> = ({ onSuccess }) => {
  const createDataSource = useCreateDataSource();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DataSourceFormData>({
    resolver: zodResolver(dataSourceSchema),
    defaultValues: {
      name: '',
      type: 's3',
      config: {},
    },
  });

  const handleCreateDataSource = useCallback(async (data: DataSourceFormData) => {
    try {
      await createDataSource.mutateAsync(data);
      reset();
      onSuccess();
    } catch (error) {
      // Error handled by mutation
    }
  }, [createDataSource, reset, onSuccess]);

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Add Data Source</DialogTitle>
        <DialogDescription>
          Connect a new data source for automated processing
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateDataSource)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ds_name">Source Name</Label>
          <Input
            id="ds_name"
            {...register('name')}
            placeholder="My S3 Bucket"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ds_type">Type</Label>
          <select
            id="ds_type"
            {...register('type')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="s3">Amazon S3</option>
            <option value="gcs">Google Cloud Storage</option>
            <option value="azure">Azure Blob Storage</option>
            <option value="supabase">Supabase Storage</option>
          </select>
          {errors.type && (
            <p className="text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createDataSource.isPending}>
            {createDataSource.isPending ? 'Adding...' : 'Add Source'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default React.memo(CreateDataSourceDialog);