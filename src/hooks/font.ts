import { getUIFont } from "@/api/font";


export function useUserUIFont() {
    getUIFont().then((rsl: any) => {
        if (!rsl.data) return;
        const { name, url } = rsl.data;

        setUIFont(name, url);
    });
}

function setUIFont(fontName: string, fontURL: string) {
    const font = new FontFace(fontName, `url('${fontURL}')`);

    font.load().then((loadedFont) => {
        (document.fonts as any).add(loadedFont);
        document.body.style.fontFamily = fontName;
    }).catch((error) => {
        console.warn(`字体加载失败: ${fontName}`, error);
    });
}