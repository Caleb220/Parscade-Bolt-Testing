import { accountApi } from '@/lib/api';
import {
  AccountSettings,
  AccountSettingsUpdate,
  IntegrationSettings,
  NotificationSettings,
  ProfileSettings,
  SecuritySettings,
  accountSettingsUpdateSchema,
  createDefaultAccountSettings,
} from '../../../schemas';
import { logger } from '../../../services/logger';

/**
 * Fetch or create account settings from API Gateway
 */
export const fetchOrCreateAccountSettings = async (
  userId: string,
  seed?: AccountSettingsUpdate,
): Promise<AccountSettings> => {
  try {
    // Fetch from API Gateway
    const profile = await accountApi.getProfile();
    logger.debug('Found existing account settings', {
      context: { feature: 'account-settings', action: 'fetchSettings', userId },
    });
    
    // Convert API profile to AccountSettings format
    const defaults = createDefaultAccountSettings(userId, seed as Partial<AccountSettings> | undefined);
    return {
      ...defaults,
      profile: {
        ...defaults.profile,
        fullName: profile.fullName || defaults.profile.fullName,
        email: profile.email,
        timezone: profile.timezone || defaults.profile.timezone,
      },
    };
  } catch (error) {
    logger.info('Creating default account settings for new user', {
      context: { feature: 'account-settings', action: 'createDefaults', userId },
    });
    
    const sanitizedSeed = seed ? accountSettingsUpdateSchema.parse(seed) : undefined;
    const defaults = createDefaultAccountSettings(userId, sanitizedSeed as Partial<AccountSettings> | undefined);
    return defaults;
  }
};

/**
 * Update account settings via API Gateway
 */
export const updateAccountSettings = async (
  userId: string,
  updates: AccountSettingsUpdate,
): Promise<AccountSettings> => {
  if (!updates || Object.keys(updates).length === 0) {
    return fetchOrCreateAccountSettings(userId);
  }

  // For now, only profile updates are supported via API Gateway
  if (updates.profile) {
    try {
      const updatedProfile = await accountApi.updateProfile({
        fullName: updates.profile.fullName,
        timezone: updates.profile.timezone,
      });
      
      // Merge with existing settings
      const currentSettings = await fetchOrCreateAccountSettings(userId);
      return {
        ...currentSettings,
        profile: {
          ...currentSettings.profile,
          fullName: updatedProfile.fullName || currentSettings.profile.fullName,
          email: updatedProfile.email,
          timezone: updatedProfile.timezone || currentSettings.profile.timezone,
        },
      };
    } catch (error) {
      logger.error('Failed to update profile via API Gateway', {
        context: { feature: 'account-settings', action: 'updateProfile' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    }
  }

  // For other sections, return current settings (to be implemented later)
  return fetchOrCreateAccountSettings(userId, updates as Partial<AccountSettings>);
};

/**
 * Update specific account settings section
 */
export const updateAccountSettingsSection = async <T extends keyof AccountSettings>(
  userId: string,
  section: T,
  value: AccountSettings[T],
): Promise<AccountSettings> => {
  const updates = accountSettingsUpdateSchema.parse({ 
    [section]: value 
  } as AccountSettingsUpdate);

  return updateAccountSettings(userId, updates);
};