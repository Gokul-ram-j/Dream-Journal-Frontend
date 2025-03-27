import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_OPENROUTER_API_KEY": JSON.stringify(process.env.VITE_OPENROUTER_API_KEY),
  },
})
