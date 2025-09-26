import { z } from 'zod';

import { accountApi } from '@/lib/api';
import type {
  AccountSettings,
  AccountSettingsUpdate,
} from '@/shared/schemas/account/accountSettings';
import {
  accountSettingsSchema,
  accountSettingsUpdateSchema,
  createDefaultAccountSettings,
  integrationSettingsSchema,
  notificationSettingsSchema,
  profileSettingsSchema,
  securitySettingsSchema,
} from '@/shared/schemas/account/accountSettings';
import { optionalIsoDateTimeSchema } from '@/shared/schemas/common';
import { logger } from '@/shared/services/logger';

const supabaseTimestampSchema = optionalIsoDateTimeSchema.nullish();

const accountSettingsRowSchema = z
  .object({
    user_id: accountSettingsSchema.shape.userId,
    profile: profileSettingsSchema.nullable(),
    security: securitySettingsSchema.nullable(),
    notifications: notificationSettingsSchema.nullable(),
    integrations: integrationSettingsSchema.nullable(),
    created_at: supabaseTimestampSchema,
    updated_at: supabaseTimestampSchema,
  })
  .strict();

type AccountSettingsRow = z.infer<typeof accountSettingsRowSchema>;

export const fetchOrCreateAccountSettings = async (
  userId: string,
  seed?: AccountSettingsUpdate
): Promise<AccountSettings> => {
  try {
    // Try to fetch from API Gateway first
    const profile = await accountApi.getProfile();
    logger.debug('Found existing account settings', {
      context: { feature: 'account-settings', action: 'fetchSettings', userId },
    });

    // Convert API profile to AccountSettings format
    const defaults = createDefaultAccountSettings(
      userId,
      seed as Partial<AccountSettings> | undefined
    );
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
    const defaults = createDefaultAccountSettings(
      userId,
      sanitizedSeed as Partial<AccountSettings> | undefined
    );
    return defaults;
  }
};

const sectionSchemaMap = {
  profile: profileSettingsSchema,
  security: securitySettingsSchema,
  notifications: notificationSettingsSchema,
  integrations: integrationSettingsSchema,
} as const;

type SectionSchemaMap = typeof sectionSchemaMap;
type SectionPayloadMap = { [K in keyof SectionSchemaMap]: z.infer<SectionSchemaMap[K]> };

export const updateAccountSettings = async (
  userId: string,
  updates: AccountSettingsUpdate
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

export const updateAccountSettingsSection = async <T extends keyof SectionSchemaMap>(
  userId: string,
  section: T,
  value: SectionPayloadMap[T]
): Promise<AccountSettings> => {
  const schema = sectionSchemaMap[section];
  const sanitizedValue = schema.parse(value);
  const updates = accountSettingsUpdateSchema.parse({
    [section]: sanitizedValue,
  } as AccountSettingsUpdate);

  return updateAccountSettings(userId, updates);
};
