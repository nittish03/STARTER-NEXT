'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ComponentProps, useEffect, useState } from 'react';

interface ExtendedThemeProviderProps extends ComponentProps<typeof NextThemesProvider> {
  colorScheme?: 'vivid-purple' | 'default';
}

export function ThemeProvider({ 
  children,
  colorScheme = 'vivid-purple',
  ...props 
}: ExtendedThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Apply color scheme class to document root
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-color-scheme', colorScheme);
    }
  }, [colorScheme]);

  // Enhanced loading state with your color palette
  if (!mounted) {
    return (
      <div 
        style={{ 
          visibility: 'hidden',
          backgroundColor: 'var(--background, #FFFFFF)',
          color: 'var(--foreground, #000000)',
          minHeight: '100vh'
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false} // Enable smooth transitions
      themes={['light', 'dark', 'system']}
      storageKey="vivid-purple-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

// Optional: Export a hook for accessing theme with color palette context
export function useVividTheme() {
  const { theme, setTheme, resolvedTheme } = require('next-themes').useTheme();
  
  const colorPalette = {
    light: {
      primary: '#D86DFC',
      secondary1: '#F4F5F7',
      secondary2: '#4A4A59',
      accent1: '#6DE1FC',
      accent2: '#FCD68D',
      neutral1: '#FFFFFF',
      neutral2: '#2D2D2D',
    },
    dark: {
      primary: '#D86DFC',
      secondary1: '#0A1325',
      secondary2: '#2D2D2D',
      accent1: '#4A4A59',
      accent2: '#FCD68D',
      neutral1: '#4A4A59',
      neutral2: '#F4F5F7',
    }
  };

  return {
    theme,
    setTheme,
    resolvedTheme,
    colors: colorPalette[resolvedTheme as keyof typeof colorPalette] || colorPalette.light
  };
}
