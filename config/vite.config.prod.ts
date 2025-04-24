import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';
import configArcoResolverPlugin from './plugin/arcoResolver';
import configImageminPlugin from './plugin/imagemin';

export default mergeConfig(
  {
    mode: 'production',
    plugins: [
      configCompressPlugin('gzip'),
      configVisualizerPlugin(),
      configArcoResolverPlugin(),
      configImageminPlugin(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            const backList = [  //频率比较低的单独打成一个包

            ];

            if (id.includes('node_modules')) {
              if (backList.length > 0 && backList.some((item) => id.includes(item))) {
                return "vender-low-frequency";
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
