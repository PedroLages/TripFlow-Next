import { test, expect } from '@playwright/test';

test.describe('Signup Page - Design Review', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('Phase 1: Initial Desktop State (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForLoadState('networkidle');
    
    // Capture initial state
    await page.screenshot({ 
      path: 'test-results/signup-desktop-initial.png', 
      fullPage: true 
    });

    // Log page structure
    const pageStructure = await page.evaluate(() => {
      const body = document.body;
      const bgColor = getComputedStyle(body).backgroundColor;
      const layout = document.querySelector('.flex.min-h-screen');
      return {
        bodyBackground: bgColor,
        layoutExists: !!layout,
        panelCount: layout?.children.length || 0
      };
    });
    console.log('Page Structure:', pageStructure);
  });

  test('Phase 2: Form Field Interactions', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Test name field focus
    await page.click('#name');
    await page.screenshot({ path: 'test-results/signup-name-focused.png' });
    
    // Check focus styles
    const nameStyles = await page.evaluate(() => {
      const input = document.querySelector('#name') as HTMLInputElement;
      const styles = getComputedStyle(input);
      return {
        borderColor: styles.borderColor,
        outline: styles.outline,
        boxShadow: styles.boxShadow,
        backgroundColor: styles.backgroundColor
      };
    });
    console.log('Name Input Focus Styles:', nameStyles);

    // Test email field
    await page.click('#email');
    await page.type('#email', 'test@example.com');
    await page.screenshot({ path: 'test-results/signup-email-filled.png' });

    // Test password field
    await page.click('#password');
    await page.type('#password', 'testpass123');
    await page.screenshot({ path: 'test-results/signup-password-filled.png' });
  });

  test('Phase 3: Form Validation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Submit empty form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500); // Wait for error messages
    await page.screenshot({ path: 'test-results/signup-empty-submit.png' });

    // Count error messages
    const errors = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('[role="alert"]');
      return Array.from(errorElements).map(el => ({
        text: el.textContent?.trim(),
        visible: el.checkVisibility()
      }));
    });
    console.log('Validation Errors:', errors);

    // Test invalid email
    await page.fill('#name', 'John Doe');
    await page.fill('#email', 'invalid-email');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/signup-invalid-email.png' });

    // Test password mismatch
    await page.fill('#email', 'test@example.com');
    await page.fill('#confirmPassword', 'different123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/signup-password-mismatch.png' });
  });

  test('Phase 4: Responsive Design - Mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'test-results/signup-mobile-375.png', 
      fullPage: true 
    });

    // Check for horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log('Mobile Horizontal Scroll:', hasHorizontalScroll);

    // Check touch target sizes
    const buttonSizes = await page.evaluate(() => {
      const submitBtn = document.querySelector('button[type="submit"]');
      const rect = submitBtn?.getBoundingClientRect();
      return {
        width: rect?.width,
        height: rect?.height,
        meetsMinimum: (rect?.width || 0) >= 44 && (rect?.height || 0) >= 44
      };
    });
    console.log('Submit Button Touch Target:', buttonSizes);
  });

  test('Phase 4: Responsive Design - Tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'test-results/signup-tablet-768.png', 
      fullPage: true 
    });

    // Check if hero image is hidden
    const heroVisible = await page.evaluate(() => {
      const hero = document.querySelector('.lg\\:block');
      return hero ? getComputedStyle(hero).display !== 'none' : false;
    });
    console.log('Hero Image Visible at 768px:', heroVisible);
  });

  test('Phase 4: Responsive Design - Desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'test-results/signup-desktop-1440.png', 
      fullPage: true 
    });

    // Check hero image layout
    const layout = await page.evaluate(() => {
      const hero = document.querySelector('.lg\\:block');
      const form = document.querySelector('form');
      const heroRect = hero?.getBoundingClientRect();
      const formRect = form?.getBoundingClientRect();
      return {
        heroVisible: !!hero && getComputedStyle(hero).display !== 'none',
        heroWidth: heroRect?.width,
        formWidth: formRect?.width,
        splitLayout: (heroRect?.width || 0) > 0 && (formRect?.width || 0) > 0
      };
    });
    console.log('Desktop Layout:', layout);
  });

  test('Phase 5: Keyboard Navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Start from first focusable element
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    // Capture focus on each field
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName,
          id: el?.id,
          type: (el as HTMLInputElement)?.type,
          hasFocusIndicator: !!getComputedStyle(el!).outline || 
                            !!getComputedStyle(el!).boxShadow
        };
      });
      console.log(`Tab ${i + 1}:`, focusedElement);
    }

    await page.screenshot({ path: 'test-results/signup-keyboard-nav.png' });
  });

  test('Phase 6: Visual Design Tokens', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    const designTokens = await page.evaluate(() => {
      const root = document.documentElement;
      const body = document.body;
      const form = document.querySelector('form');
      const heading = document.querySelector('h1');
      const input = document.querySelector('input');
      const button = document.querySelector('button[type="submit"]');
      
      const rootStyles = getComputedStyle(root);
      const bodyStyles = getComputedStyle(body);
      const headingStyles = heading ? getComputedStyle(heading) : null;
      const inputStyles = input ? getComputedStyle(input) : null;
      const buttonStyles = button ? getComputedStyle(button) : null;

      return {
        cssVariables: {
          bgBase: rootStyles.getPropertyValue('--bg-base').trim(),
          textPrimary: rootStyles.getPropertyValue('--text-primary').trim(),
          accentPrimary: rootStyles.getPropertyValue('--accent-primary').trim(),
          radiusMd: rootStyles.getPropertyValue('--radius-md').trim(),
          radiusLg: rootStyles.getPropertyValue('--radius-lg').trim(),
        },
        computed: {
          bodyBg: bodyStyles.backgroundColor,
          bodyColor: bodyStyles.color,
          headingFont: headingStyles?.fontFamily,
          headingSize: headingStyles?.fontSize,
          inputBorder: inputStyles?.borderRadius,
          inputHeight: inputStyles?.height,
          buttonBg: buttonStyles?.backgroundColor,
          buttonRadius: buttonStyles?.borderRadius,
        }
      };
    });
    console.log('Design Tokens:', JSON.stringify(designTokens, null, 2));
  });

  test('Phase 6: Color Contrast Check', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    const contrastData = await page.evaluate(() => {
      const elements = [
        { selector: 'h1', name: 'Heading' },
        { selector: 'p', name: 'Description' },
        { selector: 'label', name: 'Label' },
        { selector: 'button[type="submit"]', name: 'Button' },
      ];

      return elements.map(({ selector, name }) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        
        const styles = getComputedStyle(el);
        return {
          name,
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          fontSize: styles.fontSize,
        };
      }).filter(Boolean);
    });
    console.log('Contrast Data:', JSON.stringify(contrastData, null, 2));
  });

  test('Phase 7: Dark Mode Support', async ({ page, context }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Check if dark mode toggle exists
    const hasDarkModeToggle = await page.evaluate(() => {
      return !!document.querySelector('[data-theme-toggle]') || 
             !!document.querySelector('button[aria-label*="theme"]') ||
             !!document.querySelector('button[aria-label*="Theme"]');
    });
    console.log('Dark Mode Toggle Present:', hasDarkModeToggle);

    // Emulate dark color scheme
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test-results/signup-dark-mode.png', 
      fullPage: true 
    });

    const darkModeColors = await page.evaluate(() => {
      const body = document.body;
      const styles = getComputedStyle(body);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        isDark: styles.backgroundColor.includes('rgb(18, 18, 18)') || 
                styles.backgroundColor.includes('#121212')
      };
    });
    console.log('Dark Mode Colors:', darkModeColors);
  });

  test('Phase 8: Hover States', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Hover over submit button
    await page.hover('button[type="submit"]');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'test-results/signup-button-hover.png' });

    const buttonHoverStyles = await page.evaluate(() => {
      const button = document.querySelector('button[type="submit"]');
      if (!button) return null;
      const styles = getComputedStyle(button);
      return {
        backgroundColor: styles.backgroundColor,
        transform: styles.transform,
        boxShadow: styles.boxShadow,
      };
    });
    console.log('Button Hover Styles:', buttonHoverStyles);

    // Hover over login link
    await page.hover('a[href="/login"]');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'test-results/signup-link-hover.png' });
  });
});
