// themeStore.js
import { writable } from 'svelte/store';
import { light, dark } from './theme.js';

export const theme = writable(light);

export function toggleTheme() {
  theme.update(currentTheme => (currentTheme === light ? dark : light));
}

// Function to apply the theme to the document
export function applyTheme(theme) {
  for (const key in theme) {
    document.documentElement.style.setProperty(key, theme[key]);
  }
}

// Initial application of the light theme
applyTheme(light);
