import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';
import configArcoResolverPlugin from './plugin/arcoResolver';
import configImageminPlugin from './plugin/imagemin';
import configPwa from './plugin/pwa';

export default mergeConfig(
  {
    mode: 'production',
    plugins: [
      configCompressPlugin('gzip'),
      configVisualizerPlugin(),
      configArcoResolverPlugin(),
      configImageminPlugin(),
      configPwa()
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id:string) => {
            if (id.includes('node_modules')) {
              const moduleGroup = new Map();
              moduleGroup.set('reader', ['vue-reader','jszip','epubjs','@xmldom','core-js','event-emitter','localforage','marks-pane','path-webpack']);//Epub阅读器，用`npm ls 包名`可查看依赖关系，若多处引用则可以移除
              moduleGroup.set('low-frequency', ['diff-match-patch','html2canvas']);//低使用度的功能包

              for(const [groupName, modules] of moduleGroup) {
                if(modules.some((module:string) => id.includes(module))) {
                  return "vender-" + groupName;
                }
              }

              return "vender";
            } else if (id.includes('src/views') || id.includes("src/layout")) {
              return "views";
            }
          },
        },
      },
      commonjsOptions: {
        requireReturnsDefault: "auto" // 添加此配置
      },
      chunkSizeWarningLimit: 2000,
    },
  },
  baseConfig
);
