/**
 * Analytics Validation Schemas
 * Fully aligned with backend OpenAPI schema validation
 * Ensures type safety and proper error handling
 */

import { z } from 'zod';

// Analytics timeframe validation matching backend exactly
export const analyticsTimeframeSchema = z.enum(['day', 'week', 'month', 'year'], {
  errorMap: () => ({ message: 'Timeframe must be day, week, month, or year' }),
});

// Analytics query parameters validation schema
export const analyticsQuerySchema = z.object({
  timeframe: analyticsTimeframeSchema.optional().default('month'),
  start_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .optional(),
  end_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .optional(),
  document_type: z.string()
    .max(100, 'Document type must be 100 characters or less')
    .optional(),
}).strict().refine((data) => {
  // Both start_date and end_date must be provided together
  if (data.start_date && !data.end_date) return false;
  if (data.end_date && !data.start_date) return false;

  // If both dates are provided, start_date must be before or equal to end_date
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return startDate <= endDate;
  }

  return true;
}, {
  message: 'Both start_date and end_date must be provided together, and start_date must be before or equal to end_date',
  path: ['start_date'],
});

// Trend data point validation schema
export const trendDataPointSchema = z.object({
  period: z.string(),
  documents_processed: z.number().int().min(0),
  average_processing_time: z.number().min(0),
  accuracy_rate: z.number().min(0).max(100),
}).strict();

// Accuracy breakdown item validation schema
export const accuracyBreakdownItemSchema = z.object({
  document_type: z.string(),
  document_count: z.number().int().min(0),
  average_accuracy: z.number().min(0).max(100),
  best_accuracy: z.number().min(0).max(100),
  worst_accuracy: z.number().min(0).max(100),
}).strict();

// Error rate item validation schema
export const errorRateItemSchema = z.object({
  error_type: z.string(),
  count: z.number().int().min(0),
  percentage: z.number().min(0).max(100),
  recent_trend: z.enum(['increasing', 'decreasing', 'stable']),
}).strict();

// Analytics overview response validation schema
export const analyticsOverviewSchema = z.object({
  trends: z.object({
    data: z.array(trendDataPointSchema),
    summary: z.object({
      total_data_points: z.number().int().min(0),
      latest_processing_time: z.number().min(0),
      trend_direction: z.enum(['increasing', 'decreasing', 'stable']),
    }).strict(),
  }).strict(),
  accuracy: z.object({
    data: z.array(accuracyBreakdownItemSchema),
    summary: z.object({
      total_document_types: z.number().int().min(0),
      overall_average_accuracy: z.number().min(0).max(100),
      best_performing_type: z.string().nullable(),
    }).strict(),
  }).strict(),
  errors: z.object({
    data: z.array(errorRateItemSchema),
    summary: z.object({
      total_error_types: z.number().int().min(0),
      total_errors: z.number().int().min(0),
      most_common_error: z.string().nullable(),
    }).strict(),
  }).strict(),
  metadata: z.object({
    timeframe: analyticsTimeframeSchema,
    date_range: z.object({
      start_date: z.string().nullable(),
      end_date: z.string().nullable(),
    }).strict(),
    generated_at: z.string().datetime(),
  }).strict(),
}).strict();

// Type exports
export type AnalyticsTimeframe = z.infer<typeof analyticsTimeframeSchema>;
export type AnalyticsQueryParams = z.infer<typeof analyticsQuerySchema>;
export type TrendDataPoint = z.infer<typeof trendDataPointSchema>;
export type AccuracyBreakdownItem = z.infer<typeof accuracyBreakdownItemSchema>;
export type ErrorRateItem = z.infer<typeof errorRateItemSchema>;
export type AnalyticsOverview = z.infer<typeof analyticsOverviewSchema>;