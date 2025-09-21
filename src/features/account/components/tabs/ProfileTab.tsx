/**
 * Profile Tab Component - Enhanced with Backend Integration
 * Comprehensive profile management with avatar upload and real-time validation
 */

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Upload, Save, User, Building, Phone, Globe, Camera, AlertCircle, CheckCircle } from 'lucide-react';

import { getErrorMessage, isApiError } from '@/lib/api';
import { profileSchema, type ProfileFormData } from '@/lib/validation/account';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useToast } from '@/shared/components/ui/use-toast';
import { useUpdateAccount, useUploadAvatar } from '@/shared/hooks/api/useAccountData';

import { formatUserAgent, formatDate } from '@/shared/utils/formatters';
import { useClipboard } from '@/shared/hooks/useClipboard';
import { useAccountContext } from '../AccountLayout';

const ProfileTab: React.FC = () => {
  const { user, isLoading, error: contextError } = useAccountContext();
  const { toast } = useToast();
  const updateAccount = useUpdateAccount();
  const uploadAvatar = useUploadAvatar();
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      username: '',
      company: '',
      role: '',
      phone: '',
      locale: 'en-US',
      timezone: 'UTC',
    },
  });

  // Reset form when user data changes
  React.useEffect(() => {
    if (user) {
      reset({
        full_name: user.fullName || '',
        username: user.username || '',
        company: user.company || '',
        role: user.role || '',
        phone: user.phone || '',
        locale: user.locale || 'en-US',
        timezone: user.timezone || 'UTC',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateAccount.mutateAsync(data);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      
      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleAvatarChange = async (file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPEG, PNG, WebP).',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Avatar image must be less than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    try {
      await uploadAvatar.mutateAsync(file);
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully.',
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      // Reset preview on error
      setAvatarPreview(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleAvatarChange(file);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (contextError) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load profile</h3>
            <p className="text-gray-600 mb-4">{getErrorMessage(contextError)}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Upload a profile picture to personalize your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div 
              className={`relative cursor-pointer transition-all duration-200 ${
                isDragOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview || user?.avatarUrl ? (
                <div className="relative">
                  <img
                    src={avatarPreview || user?.avatarUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  {uploadAvatar.isPending && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-full flex items-center justify-center opacity-0 hover:opacity-100">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button 
                variant="outline" 
                size="sm" 
                className="cursor-pointer"
                disabled={uploadAvatar.isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadAvatar.isPending ? 'Uploading...' : 'Upload Image'}
              </Button>
              
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG or WebP. Max 5MB. Drag & drop or click to select.
              </p>
              
              {uploadAvatar.error && (
                <p className="text-sm text-red-600 mt-1">
                  {getErrorMessage(uploadAvatar.error)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="full_name"
                    {...register('full_name')}
                    placeholder="Enter your full name"
                    className="pl-8 pr-3"
                  />
                </div>
                {errors.full_name && (
                  <p className="text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register('username')}
                  placeholder="Choose a username"
                  className="px-3"
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
                <p className="text-xs text-gray-500">Used for public profile and API access</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="company"
                    {...register('company')}
                    placeholder="Your company name"
                    className="pl-8 pr-3"
                  />
                </div>
                {errors.company && (
                  <p className="text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Job Title</Label>
                <Input
                  id="role"
                  {...register('role')}
                  placeholder="Your job title"
                  className="px-3"
                />
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+1234567890"
                    className="pl-8 pr-3"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
                <p className="text-xs text-gray-500">Use E.164 format (+country code)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    id="timezone"
                    {...register('timezone')}
                    className="flex h-10 w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Berlin">Berlin</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Shanghai">Shanghai</option>
                    <option value="Australia/Sydney">Sydney</option>
                  </select>
                </div>
                {errors.timezone && (
                  <p className="text-sm text-red-600">{errors.timezone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="locale">Language</Label>
                <select
                  id="locale"
                  {...register('locale')}
                  className="flex h-10 w-full rounded-md border border-input bg-background py-2 px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Español</option>
                  <option value="fr-FR">Français</option>
                  <option value="de-DE">Deutsch</option>
                  <option value="ja-JP">日本語</option>
                  <option value="zh-CN">中文 (简体)</option>
                </select>
                {errors.locale && (
                  <p className="text-sm text-red-600">{errors.locale.message}</p>
                )}
              </div>
            </div>

            {/* Read-only Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={user?.email || ''} disabled className="px-3 bg-gray-50" />
                  <p className="text-xs text-gray-500">Contact support to change your email</p>
                </div>

                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input 
                    value={user?.id || ''} 
                    disabled 
                    className="font-mono text-xs px-3 bg-gray-50" 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Plan</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={user?.plan || 'Free'} 
                      disabled 
                      className="capitalize px-3 bg-gray-50 flex-1" 
                    />
                    <Button variant="outline" size="sm">
                      Upgrade
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <Input 
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''} 
                    disabled
                    className="px-3 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Form Errors */}
            {updateAccount.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-red-700">
                  {getErrorMessage(updateAccount.error)}
                </span>
              </motion.div>
            )}

            {/* Success Message */}
            {updateAccount.isSuccess && !isDirty && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-green-700">
                  Profile updated successfully
                </span>
              </motion.div>
            )}

            {/* Save Button - Sticky on Mobile */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 sm:static sm:bg-transparent sm:border-t-0 sm:p-0 sm:mx-0">
              <Button
                type="submit"
                disabled={!isDirty || updateAccount.isPending || isSubmitting}
                className="w-full sm:w-auto"
              >
                {updateAccount.isPending || isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileTab;