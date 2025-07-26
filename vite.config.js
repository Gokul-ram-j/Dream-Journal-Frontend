import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_OPENROUTER_API_KEY": JSON.stringify(process.env.VITE_OPENROUTER_API_KEY),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // <--- sets @ to point to /src folder
    },
  },
})
