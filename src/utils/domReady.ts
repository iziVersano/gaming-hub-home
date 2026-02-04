/**
 * DOM utility functions for safe DOM manipulation
 */

/**
 * Ensures callback runs after DOM is ready
 */
export const domReady = (callback: () => void): void => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
};

/**
 * Safe appendChild that only accepts Node objects
 */
export const safeAppendChild = (container: Element | null, child: Node | null): boolean => {
  if (container instanceof Node && child instanceof Node) {
    container.appendChild(child);
    return true;
  }
  return false;
};

/**
 * Safe querySelector with null checking
 */
export const safeQuerySelector = (selector: string): Element | null => {
  try {
    return document.querySelector(selector);
  } catch (error) {
    console.warn(`querySelector failed for selector: ${selector}`, error);
    return null;
  }
};

/**
 * Safe insertAdjacentHTML for inserting HTML strings
 */
export const safeInsertHTML = (container: Element | null, position: InsertPosition, html: string): boolean => {
  if (container instanceof Element) {
    try {
      container.insertAdjacentHTML(position, html);
      return true;
    } catch (error) {
      console.warn('insertAdjacentHTML failed:', error);
      return false;
    }
  }
  return false;
};