import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import viteSvgIcons from 'vite-plugin-svg-icons';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import viteCompression from 'vite-plugin-compression';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import { VitePWA } from 'vite-plugin-pwa';

import { resolve } from 'path';

export default ({ mode }) => {
  return defineConfig({
    plugins: [
      vue(),
      viteCompression(),
      AutoImport({ dts: 'src/auto-imports.d.ts', imports: ['vue'] }),
      viteSvgIcons({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      vueSetupExtend(),
      Pages(),
      Layouts({ defaultLayout: 'default/index' }),
      VitePWA({
        includeAssets: ['favicon.svg'],
        manifest: false,
        registerType: 'autoUpdate',
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /someInterface/i, // 接口缓存 此处填你想缓存的接口正则匹配
              handler: 'CacheFirst',
              options: {
                cacheName: 'interface-cache',
              },
            },
            {
              urlPattern: /(.*?)\.(js|css|ts)/, // js /css /ts静态资源缓存
              handler: 'CacheFirst',
              options: {
                cacheName: 'js-css-cache',
              },
            },
            {
              urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    base: loadEnv(mode, process.cwd()).VITE_PUBLIC_PATH,
    server: {
      port: 8080,
      open: true,
      cors: true,
    },
  });
};
