/**
 * Profile Tab Component - Enhanced with Backend Integration
 * Comprehensive profile management with avatar upload and real-time validation
 * Updated to use snake_case field names matching OpenAPI schema
 */ 

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Save, 
  User, 
  Building, 
  Phone, 
  Globe, 
  Camera, 
  AlertCircle, 
  CheckCircle,
  Mail,
  Calendar,
  Shield,
  Crown,
  AtSign,
  Briefcase
} from 'lucide-react';

import { getErrorMessage } from '@/lib/api';
import { profileSchema, type ProfileFormData } from '@/lib/validation/account';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useToast } from '@/shared/components/ui/use-toast';
import { useUpdateAccount, useUploadAvatar } from '@/shared/hooks/api/useAccountData';
import { formatDate } from '@/shared/utils/date';
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
        full_name: user.full_name || '',
        username: user.username || '',
        company: user.company || '',
        role: user.role || '', // Job title field
        phone: user.phone || '',
        locale: user.locale || 'en-US',
        timezone: user.timezone || 'UTC',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Convert form data to UpdateProfileRequest format
      const updateData = {
        full_name: data.full_name || null,
        username: data.username || null,
        company: data.company || null,
        role: data.role || null, // Job title
        phone: data.phone || null,
        locale: data.locale || null,
        timezone: data.timezone || null,
      };

      await updateAccount.mutateAsync(updateData);
    } catch (error) {
      // Error handling is done in the mutation
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
    } catch (error) {
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
      {/* Profile Header with Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Profile Overview
          </CardTitle>
          <CardDescription>
            Manage your personal information and account preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div 
              className={`relative cursor-pointer transition-all duration-200 ${
                isDragOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview || user?.avatar_url ? (
                <div className="relative">
                  <img
                    src={avatarPreview || user?.avatar_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
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
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-200 border-4 border-white shadow-lg">
                  <span className="text-white text-2xl font-bold">
                    {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {user?.full_name || 'Welcome to Parscade'}
                </h3>
                <p className="text-gray-600">@{user?.username || 'username'}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="w-4 h-4 mr-1" />
                    {user?.email}
                  </div>
                  {user?.email_verified && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
              
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
                className="cursor-pointer bg-white hover:bg-gray-50"
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

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Keep your personal details up to date for a better experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Editable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="full_name"
                    {...register('full_name')}
                    placeholder="Enter your full name"
                    className="px-3 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.full_name && (
                  <p className="text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center text-sm font-medium text-gray-700">
                  <AtSign className="w-4 h-4 mr-2 text-gray-500" />
                  Username
                </Label>
                <Input
                  id="username"
                  {...register('username')}
                  placeholder="Choose a username"
                  className="px-3 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
                <p className="text-xs text-gray-500">Unique identifier for your account</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center text-sm font-medium text-gray-700">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  Company
                </Label>
                <div className="relative">
                  <Input
                    id="company"
                    {...register('company')}
                    placeholder="Your company name"
                    className="px-3 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.company && (
                  <p className="text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center text-sm font-medium text-gray-700">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                  Job Title
                </Label>
                <div className="relative">
                  <Input
                    id="role"
                    {...register('role')}
                    placeholder="Your job title"
                    className="px-3 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+1234567890"
                    className="px-3 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
                <p className="text-xs text-gray-500">Include country code (e.g., +1 for US)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center text-sm font-medium text-gray-700">
                  <Globe className="w-4 h-4 mr-2 text-gray-500" />
                  Timezone
                </Label>
                <div className="relative">
                  <select
                    id="timezone"
                    {...register('timezone')}
                    className="flex h-10 w-full rounded-md border border-input bg-background py-2 px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                <Label htmlFor="locale" className="flex items-center text-sm font-medium text-gray-700">
                  <Globe className="w-4 h-4 mr-2 text-gray-500" />
                  Language & Region
                </Label>
                <select
                  id="locale"
                  {...register('locale')}
                  className="flex h-10 w-full rounded-md border border-input bg-background py-2 px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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

            {/* Form Actions */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                type="submit"
                disabled={!isDirty || updateAccount.isPending || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
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

      {/* Account Information - Read Only */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Account Information
          </CardTitle>
          <CardDescription>
            View your account details and security information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    Email Address
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={user?.email || ''} 
                      disabled 
                      className="px-3 bg-gray-100 border-gray-200 text-gray-700" 
                    />
                    {user?.email_verified && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Contact support to change your email address</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    User ID
                  </Label>
                  <Input 
                    value={user?.id || ''} 
                    disabled 
                    className="font-mono text-xs px-3 bg-gray-100 border-gray-200 text-gray-700" 
                  />
                  <p className="text-xs text-gray-500">Your unique account identifier</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-gray-700">
                    <Shield className="w-4 h-4 mr-2 text-gray-500" />
                    Account Role
                  </Label>
                  <Input 
                    value={user?.user_role === 'admin' ? 'Administrator' : 'User'} 
                    disabled 
                    className="capitalize px-3 bg-gray-100 border-gray-200 text-gray-700" 
                  />
                  <p className="text-xs text-gray-500">Contact support to change your role</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-gray-700">
                    <Crown className="w-4 h-4 mr-2 text-blue-600" />
                    Current Plan
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={user?.plan === 'free' ? 'Beta (Free)' : user?.plan?.toUpperCase() || 'Beta'} 
                      disabled 
                      className="capitalize px-3 bg-white border-blue-200 text-blue-700 font-medium flex-1" 
                    />
                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                      Upgrade
                    </Button>
                  </div>
                  <p className="text-xs text-blue-600">Enjoy early access to all beta features</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    Member Since
                  </Label>
                  <Input 
                    value={user?.created_at ? formatDate(user.created_at) : ''} 
                    disabled
                    className="px-3 bg-gray-100 border-gray-200 text-gray-700"
                  />
                  <p className="text-xs text-gray-500">When you joined the Parscade community</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      <div className="space-y-4">
        {/* Form Errors */}
        {updateAccount.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Update Failed</p>
              <p className="text-sm text-red-700">{getErrorMessage(updateAccount.error)}</p>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {updateAccount.isSuccess && !isDirty && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Profile Updated</p>
              <p className="text-sm text-green-700">Your profile information has been saved successfully</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileTab;