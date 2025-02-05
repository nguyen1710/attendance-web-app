import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // Lắng nghe trên tất cả địa chỉ
    port: 5173, // Dùng cổng của Render hoặc fallback về 5173
  },
  plugins: [
    react(),
    svgr()
  ],
  // base: './'
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
