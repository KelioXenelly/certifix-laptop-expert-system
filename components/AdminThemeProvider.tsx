'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0ea5e9' },
    secondary: { main: '#8b5cf6' },
    background: { default: '#f8fafc', paper: '#ffffff' },
  },
  typography: { fontFamily: 'inherit' },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: '8px', fontWeight: 600 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
        }
      }
    }
  },
});

export default function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={lightTheme}>
      {children}
    </ThemeProvider>
  );
}
