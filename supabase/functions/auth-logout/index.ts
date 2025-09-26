/**
 * Server-side logout endpoint for hard logout implementation
 *
 * Features:
 * - Sets Clear-Site-Data headers to purge browser caches
 * - Adds Cache-Control headers to prevent caching
 * - Redirects to login with logout confirmation
 * - Provides additional security layer for complete session termination
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the origin from the request for proper redirects
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const referer = req.headers.get('referer') || '';

    // Determine the base URL for redirects
    let baseUrl = origin;
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        baseUrl = `${refererUrl.protocol}//${refererUrl.host}`;
      } catch {
        // Fallback to origin if referer parsing fails
      }
    }

    // Create comprehensive security headers for complete logout
    const securityHeaders = {
      ...corsHeaders,

      // Clear all site data - this is the key header for hard logout
      'Clear-Site-Data': '"cache", "cookies", "storage", "executionContexts"',

      // Prevent any caching of this response
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',

      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'no-referrer',

      // Additional cache busting
      'Surrogate-Control': 'no-store',
      Vary: '*',
    };

    // Log the logout attempt for monitoring
    console.log('Server-side logout requested:', {
      timestamp: new Date().toISOString(),
      origin: origin,
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
    });

    // For GET requests, redirect to login with logout confirmation
    if (req.method === 'GET') {
      const loginUrl = `${baseUrl}/login?logged_out=1&t=${Date.now()}`;

      return new Response(null, {
        status: 302,
        headers: {
          ...securityHeaders,
          Location: loginUrl,
        },
      });
    }

    // For POST requests (API calls), return JSON response
    if (req.method === 'POST') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Logout completed successfully',
          redirectUrl: baseUrl,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            ...securityHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Method not allowed
    return new Response(
      JSON.stringify({
        error: 'Method not allowed',
        allowedMethods: ['GET', 'POST', 'OPTIONS'],
      }),
      {
        status: 405,
        headers: {
          ...securityHeaders,
          'Content-Type': 'application/json',
          Allow: 'GET, POST, OPTIONS',
        },
      }
    );
  } catch (error) {
    console.error('Server logout error:', error);

    // Even on error, return security headers to clear data
    return new Response(
      JSON.stringify({
        error: 'Logout service error',
        message: 'An error occurred during logout, but security cleanup was attempted.',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Clear-Site-Data': '"cache", "cookies", "storage"', // Still try to clear data
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
