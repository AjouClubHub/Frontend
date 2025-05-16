import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy:{
      '/api': {
        target: 'http://ec2-15-164-104-154.ap-northeast-2.compute.amazonaws.com:8080', // 프록시할 서버 주소
        changeOrigin: true, // 서버의 호스트 헤더를 타겟의 호스트로 변경
        secure: false, // https를 사용하는 서버에 대해서는 true로 설정, localhost는 http 사용
        rewrite: (path) => path.replace(/^\/api/, ''), // '/api' 부분을 제거하고 서버로 요청을 전달
      },

    }
   
  },
})
