// vite.config.js
import { defineConfig } from "file:///D:/UBB/vitalCHECK/client/node_modules/vite/dist/node/index.js";
import react from "file:///D:/UBB/vitalCHECK/client/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://ubb-enterprise-health-check.onrender.com",
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    // Optimisations pour PWA
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          i18n: ["react-i18next", "i18next"],
          ui: ["lucide-react", "framer-motion"],
          charts: ["recharts"],
          forms: ["react-hook-form"],
          toast: ["react-hot-toast"]
        }
      }
    },
    // Augmenter la limite de taille pour les chunks
    chunkSizeWarningLimit: 1e3,
    // Optimiser les assets
    assetsInlineLimit: 4096,
    // Minifier le CSS
    cssCodeSplit: true,
    // Source maps pour le debug
    sourcemap: false
  },
  // Configuration PWA
  define: {
    __PWA_VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0")
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVQkJcXFxcdml0YWxDSEVDS1xcXFxjbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVCQlxcXFx2aXRhbENIRUNLXFxcXGNsaWVudFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVUJCL3ZpdGFsQ0hFQ0svY2xpZW50L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vdWJiLWVudGVycHJpc2UtaGVhbHRoLWNoZWNrLm9ucmVuZGVyLmNvbScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gT3B0aW1pc2F0aW9ucyBwb3VyIFBXQVxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgICAgICAgcm91dGVyOiBbJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICBpMThuOiBbJ3JlYWN0LWkxOG5leHQnLCAnaTE4bmV4dCddLFxuICAgICAgICAgIHVpOiBbJ2x1Y2lkZS1yZWFjdCcsICdmcmFtZXItbW90aW9uJ10sXG4gICAgICAgICAgY2hhcnRzOiBbJ3JlY2hhcnRzJ10sXG4gICAgICAgICAgZm9ybXM6IFsncmVhY3QtaG9vay1mb3JtJ10sXG4gICAgICAgICAgdG9hc3Q6IFsncmVhY3QtaG90LXRvYXN0J11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gQXVnbWVudGVyIGxhIGxpbWl0ZSBkZSB0YWlsbGUgcG91ciBsZXMgY2h1bmtzXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICAgIC8vIE9wdGltaXNlciBsZXMgYXNzZXRzXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsXG4gICAgLy8gTWluaWZpZXIgbGUgQ1NTXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxuICAgIC8vIFNvdXJjZSBtYXBzIHBvdXIgbGUgZGVidWdcbiAgICBzb3VyY2VtYXA6IGZhbHNlXG4gIH0sXG4gIC8vIENvbmZpZ3VyYXRpb24gUFdBXG4gIGRlZmluZToge1xuICAgIF9fUFdBX1ZFUlNJT05fXzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYubnBtX3BhY2thZ2VfdmVyc2lvbiB8fCAnMS4wLjAnKVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUSxTQUFTLG9CQUFvQjtBQUMvUixPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzdCLFFBQVEsQ0FBQyxrQkFBa0I7QUFBQSxVQUMzQixNQUFNLENBQUMsaUJBQWlCLFNBQVM7QUFBQSxVQUNqQyxJQUFJLENBQUMsZ0JBQWdCLGVBQWU7QUFBQSxVQUNwQyxRQUFRLENBQUMsVUFBVTtBQUFBLFVBQ25CLE9BQU8sQ0FBQyxpQkFBaUI7QUFBQSxVQUN6QixPQUFPLENBQUMsaUJBQWlCO0FBQUEsUUFDM0I7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSx1QkFBdUI7QUFBQTtBQUFBLElBRXZCLG1CQUFtQjtBQUFBO0FBQUEsSUFFbkIsY0FBYztBQUFBO0FBQUEsSUFFZCxXQUFXO0FBQUEsRUFDYjtBQUFBO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixpQkFBaUIsS0FBSyxVQUFVLFFBQVEsSUFBSSx1QkFBdUIsT0FBTztBQUFBLEVBQzVFO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
