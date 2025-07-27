import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  // GitHub Pages 部署配置
  base: process.env.NODE_ENV === 'production' ? '/tarotaro/' : '/',
  // 环境变量配置
  define: {
    'import.meta.env.VITE_QIANWEN_API_KEY': JSON.stringify(process.env.VITE_QIANWEN_API_KEY || 'demo-key-for-build')
  },
  // 开发服务器配置
  server: {
    host: true,
    port: 5173,
    open: true
  }
})
