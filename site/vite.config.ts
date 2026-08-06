import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // accessible-react-form is linked via `file:..`, so Vite would otherwise
  // resolve its react / react-hook-form imports to the repo-root node_modules,
  // giving the app two copies of each. Two Reacts throw "Invalid hook call";
  // two react-hook-forms break FormProvider context. Force a single copy.
  resolve: {
    dedupe: ['react', 'react-dom', 'react-hook-form'],
  },
})
