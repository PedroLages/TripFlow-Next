/**
 * ESLint rule: no-hardcoded-colors
 *
 * Prevents hardcoded hex/rgb/hsl color values in favor of CSS design tokens.
 *
 * ✅ Allowed:
 * - Token definitions in globals.css
 * - Browser meta tags (theme-color, etc.)
 * - Documentation comments and JSDoc
 * - Test mocks and fixtures
 *
 * ❌ Blocked:
 * - Inline hex colors (#3B82F6, #fff)
 * - RGB/RGBA literals (rgb(255, 0, 0))
 * - HSL/HSLA literals (hsl(200, 50%, 50%))
 *
 * @example
 * // ❌ BAD
 * const color = '#3B82F6';
 * <div style={{ background: 'rgb(255, 0, 0)' }} />
 *
 * // ✅ GOOD
 * const color = 'var(--color-info)';
 * <div style={{ background: 'var(--color-danger)' }} />
 */

const hexColorRegex = /#[0-9A-Fa-f]{3,8}\b/g;
const rgbColorRegex = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/gi;
const hslColorRegex = /hsla?\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?/gi;

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded color values (use CSS design tokens instead)',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      hardcodedHex: 'Hardcoded hex color "{{value}}" found. Use CSS design tokens (e.g., var(--color-info)) instead.',
      hardcodedRgb: 'Hardcoded RGB color "{{value}}" found. Use CSS design tokens instead.',
      hardcodedHsl: 'Hardcoded HSL color "{{value}}" found. Use CSS design tokens instead.',
    },
    schema: [], // No options
  },

  create(context) {
    const filename = context.getFilename();

    // ========================================
    // ALLOWED FILES (never report errors)
    // ========================================

    const allowedPatterns = [
      /globals\.css$/,              // Token definitions
      /tailwind\.config\./,         // Tailwind config
      /\.test\.(ts|tsx|js|jsx)$/,  // Test files
      /\.spec\.(ts|tsx|js|jsx)$/,  // Spec files
      /\.stories\.(ts|tsx|js|jsx)$/,// Storybook
      /__mocks__\//,                // Test mocks
      /eslint-local-rules\//,       // This file!
    ];

    if (allowedPatterns.some(pattern => pattern.test(filename))) {
      return {}; // Skip this file entirely
    }

    // ========================================
    // ALLOWED CONTEXTS (within other files)
    // ========================================

    /**
     * Check if node is inside a JSDoc comment or documentation string
     */
    function isInDocumentation(node) {
      const sourceCode = context.getSourceCode();
      const comments = sourceCode.getAllComments();

      return comments.some(comment => {
        if (comment.type !== 'Block') return false;
        // Check if it's a JSDoc comment (starts with **)
        if (!comment.value.trim().startsWith('*')) return false;
        // Check if node is within this comment's range
        return node.range[0] >= comment.range[0] && node.range[1] <= comment.range[1];
      });
    }

    /**
     * Check if this is a browser meta tag (theme-color, etc.)
     */
    function isMetaTag(node) {
      // Check if we're in a JSX attribute
      if (node.parent?.type !== 'JSXAttribute') return false;

      // Check if parent JSX element is <meta>
      const jsxElement = node.parent.parent?.parent;
      if (jsxElement?.type !== 'JSXElement') return false;
      if (jsxElement.openingElement?.name?.name !== 'meta') return false;

      // Allow content attribute on meta tags
      return node.parent.name?.name === 'content';
    }

    /**
     * Check if this is an OKLCH token definition
     */
    function isOklchToken(value) {
      return /oklch\(/.test(value);
    }

    /**
     * Check if this is a CSS variable reference
     */
    function isCssVariable(value) {
      return /var\(--/.test(value);
    }

    // ========================================
    // VIOLATION DETECTION
    // ========================================

    function checkStringValue(node, value) {
      // Skip if in documentation
      if (isInDocumentation(node)) return;

      // Skip if meta tag
      if (isMetaTag(node)) return;

      // Skip if OKLCH or CSS variable (allowed token usage)
      if (isOklchToken(value) || isCssVariable(value)) return;

      // Check for hex colors
      const hexMatches = value.match(hexColorRegex);
      if (hexMatches) {
        hexMatches.forEach(match => {
          context.report({
            node,
            messageId: 'hardcodedHex',
            data: { value: match },
          });
        });
      }

      // Check for RGB colors
      const rgbMatches = value.match(rgbColorRegex);
      if (rgbMatches) {
        rgbMatches.forEach(match => {
          context.report({
            node,
            messageId: 'hardcodedRgb',
            data: { value: match },
          });
        });
      }

      // Check for HSL colors
      const hslMatches = value.match(hslColorRegex);
      if (hslMatches) {
        hslMatches.forEach(match => {
          context.report({
            node,
            messageId: 'hardcodedHsl',
            data: { value: match },
          });
        });
      }
    }

    // ========================================
    // AST VISITORS
    // ========================================

    return {
      // String literals
      Literal(node) {
        if (typeof node.value === 'string') {
          checkStringValue(node, node.value);
        }
      },

      // Template literals (backticks)
      TemplateElement(node) {
        checkStringValue(node, node.value.raw);
      },

      // JSX attribute values
      JSXAttribute(node) {
        if (node.value?.type === 'Literal' && typeof node.value.value === 'string') {
          checkStringValue(node.value, node.value.value);
        }
      },
    };
  },
};
