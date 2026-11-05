import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'organization';
  keywords?: string[];
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const SITE_NAME = 'SBBM Social Foundation';
const BASE_URL = 'https://sbbmsocialfoundation.org';
const DEFAULT_IMAGE = `${BASE_URL}/assets/images/logo.jpg`;
const DEFAULT_DESCRIPTION =
  'Official platform of SBBM Social Foundation — an active grassroots non-profit in Nagpur dedicated to senior citizens shelter at Vyenkatesh Ashram, free Annadaan, youth computer education, women self-reliance, and Go-Seva. Registered under MAH/332/15/NAG with 80G tax benefits.';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = '/',
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  keywords = [
    'SBBM Social Foundation',
    'Vyenkatesh Ashram',
    'Old Age Home Nagpur',
    'Vrudhashram Mahuli Parseoni',
    '80G Tax Exemption Donation',
    'Senior Citizen Shelter',
    'Free Annadaan',
    'Go-Seva Nagpur',
    'Rural Computer Literacy',
    'NGO Darpan Maharashtra',
  ],
  jsonLd,
}) => {
  const fullTitle = !title || title === SITE_NAME || canonicalPath === '/'
    ? SITE_NAME
    : `${SITE_NAME} | ${title.replace(/\s*\|\s*SBBM Social Foundation/gi, '')}`;

  const canonicalUrl = `${BASE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to create or update meta tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords.join(', '));
    setMetaTag('name', 'author', 'SBBM Social Foundation Society');
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Canonical Link
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', absoluteOgImage);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:locale', 'en_IN');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', absoluteOgImage);

    // 6. Dynamic JSON-LD Structured Data
    const scriptId = 'page-structured-data';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd, null, 2);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Clean up dynamic schema when unmounting page
      const currentScript = document.getElementById(scriptId);
      if (currentScript) {
        currentScript.remove();
      }
    };
  }, [fullTitle, description, canonicalUrl, absoluteOgImage, ogType, keywords, jsonLd]);

  return null;
};

