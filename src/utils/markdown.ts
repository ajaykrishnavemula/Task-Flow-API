import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

/**
 * Convert markdown to HTML and sanitize it
 * @param markdown Markdown content
 * @returns Sanitized HTML
 */
export const markdownToHtml = (markdown: string): string => {
  if (!markdown) {
    return '';
  }
  
  // Convert markdown to HTML
  const html = marked(markdown);
  
  // Sanitize HTML to prevent XSS attacks
  const sanitizedHtml = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title'],
      a: ['href', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
  
  return sanitizedHtml;
};

/**
 * Extract plain text from markdown
 * @param markdown Markdown content
 * @returns Plain text
 */
export const markdownToText = (markdown: string): string => {
  if (!markdown) {
    return '';
  }
  
  // Convert markdown to HTML
  const html = marked(markdown);
  
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  const decoded = text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/&#039;/g, "'");
  
  return decoded;
};

/**
 * Extract summary from markdown (first 100 characters)
 * @param markdown Markdown content
 * @param length Maximum length of summary
 * @returns Summary text
 */
export const extractSummary = (markdown: string, length = 100): string => {
  const text = markdownToText(markdown);
  
  if (text.length <= length) {
    return text;
  }
  
  return text.substring(0, length) + '...';
};

// Made with Bob
