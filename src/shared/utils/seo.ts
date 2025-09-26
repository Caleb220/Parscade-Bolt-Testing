/**
 * SEO Utilities
 * Provides dynamic SEO management for single-page applications
 */

import type { SeoConfig } from '@/shared/schemas';

/**
 * Default SEO configuration
 */
export const defaultSEO: SeoConfig = {
  title: 'Parscade - Intelligent Document Processing',
  description:
    'Transform unstructured documents into structured data with our intelligent parsing platform. Join our beta program and help build the future of document processing.',
  keywords:
    'document parsing, data extraction, OCR, document processing, AI parsing, structured data, enterprise software, beta program',
  author: 'Parscade',
  url: 'https://parscade.com',
  image: 'https://parscade.com/main-logo.png',
  type: 'website',
  siteName: 'Parscade',
};

/**
 * Update document head with SEO metadata
 */
export const updateSEO = (config: Partial<SeoConfig>): void => {
  const seoConfig = { ...defaultSEO, ...config };

  // Update title
  document.title = seoConfig.title;

  // Update or create meta tags
  const updateMetaTag = (name: string, content: string, property?: string) => {
    const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;

    if (!meta) {
      meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  };

  // Standard meta tags
  updateMetaTag('description', seoConfig.description);
  updateMetaTag('keywords', seoConfig.keywords);
  updateMetaTag('author', seoConfig.author);

  // Open Graph tags
  updateMetaTag('og:title', seoConfig.title, 'og:title');
  updateMetaTag('og:description', seoConfig.description, 'og:description');
  updateMetaTag('og:url', seoConfig.url, 'og:url');
  updateMetaTag('og:image', seoConfig.image, 'og:image');
  updateMetaTag('og:type', seoConfig.type, 'og:type');
  updateMetaTag('og:site_name', seoConfig.siteName, 'og:site_name');

  // Twitter tags
  updateMetaTag('twitter:card', 'summary_large_image', 'twitter:card');
  updateMetaTag('twitter:title', seoConfig.title, 'twitter:title');
  updateMetaTag('twitter:description', seoConfig.description, 'twitter:description');
  updateMetaTag('twitter:image', seoConfig.image, 'twitter:image');
  updateMetaTag('twitter:url', seoConfig.url, 'twitter:url');

  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', seoConfig.url);
};
