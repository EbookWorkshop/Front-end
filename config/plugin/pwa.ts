import { VitePWA } from 'vite-plugin-pwa';
import manifestSetting from '../../public/manifest.webmanifest' with { type: 'json' };
import { name, version } from "../../package.json"

export default function configPwa() {

    let defaultManifest =
    {
        ...manifestSetting,
        version: version,
    }
    return VitePWA({
        manifest: defaultManifest,
        workbox: {
            cacheId: `${name}-v${version}`,
            globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        }
    })
}