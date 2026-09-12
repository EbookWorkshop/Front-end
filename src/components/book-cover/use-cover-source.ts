// components/book-cover/use-cover-source.ts
import { computed, ref, watch, type Ref } from 'vue';
import { getApiBaseUrl } from '@/utils/config';

/** 追加在封面路径末尾的标记，表示“在图片封面上叠加书名” */
export const SHOW_BOOKNAME_FLAG = '#showname';

/** 缺省封面（无值）时的默认底色：靛蓝，与 book-classical 的默认 prop 一致 */
export const DEFAULT_COVER_COLOR = '#0b3154';

/** 图片加载失败时的兜底底色：青绿 */
export const ERROR_COVER_COLOR = '#00b400';

/** 图片加载中的占位底色：锦缎紫 */
export const LOADING_COVER_COLOR = '#6b4c7a';


const COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const ABSOLUTE_URL_PATTERN = /^(?:https?:)?\/\//i;

/** 归一化后的封面形态 */
export type CoverSource =
    | { kind: 'classical'; color: string }
    | { kind: 'image'; url: string; showBookName: boolean };

type ImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

function toAbsoluteUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('blob:') || ABSOLUTE_URL_PATTERN.test(path)) return path;
    const host = getApiBaseUrl();
    return path.startsWith('/') ? `${host}${path}` : `${host}/${path}`;
}

/**
 * 把后端返回的 coverImg 归一化成两种封面形态：
 * - 空值 / `#showname` / `#` 开头的颜色值  → 线装书封面
 * - 其余视为图片路径                        → 图片封面
 */
export function parseCover(raw: string, showEmbedBookName: boolean): CoverSource {
    const value = (raw ?? '').trim();

    // 缺省（null / 空字符串）→ 靛蓝线装书，与原始默认行为一致
    if (!value) {
        return { kind: 'classical', color: DEFAULT_COVER_COLOR };
    }

    // 显式颜色值 → 使用该颜色
    if (COLOR_PATTERN.test(value)) {
        return { kind: 'classical', color: value };
    }

    // 其余按图片路径处理（含 `路径#showname` 形式）
    const showBookName = showEmbedBookName || value.includes(SHOW_BOOKNAME_FLAG);
    const [path] = value.split(SHOW_BOOKNAME_FLAG);

    // 只有 #showname 没有路径这种异常值 → 仍按缺省走靛蓝，
    if (!path) {
        return { kind: 'classical', color: ERROR_COVER_COLOR };
    }
    return { kind: 'image', url: toAbsoluteUrl(path), showBookName };
}

/**
 * 封面状态机：负责解析 + 预加载图片，向上只吐出一个可直接渲染的 CoverSource。
 *
 * 渲染规则：
 * - 颜色 / 空值            → 线装书（用该颜色 / 兜底绿）
 * - 图片加载成功           → 图片封面
 * - 图片加载失败           → 线装书（兜底绿）
 * - 图片加载中（含未开始） → 线装书（锦缎紫）
 */
export function useCoverSource(
    rawCover: Ref<string>,
    showEmbedBookName: Ref<boolean>,
) {
    const parsed = computed(() => parseCover(rawCover.value, showEmbedBookName.value));
    const imageUrl = computed(() =>
        parsed.value.kind === 'image' ? parsed.value.url : '',
    );

    const imageStatus = ref<ImageStatus>('idle');
    // 令牌用于丢弃过期请求的回调，避免快速切换封面时状态错乱
    let loadToken = 0;

    watch(
        imageUrl,
        (url) => {
            const token = ++loadToken;
            if (!url) {
                imageStatus.value = 'idle';
                return;
            }
            imageStatus.value = 'loading';

            const probe = new Image();
            probe.onload = () => {
                if (token === loadToken) imageStatus.value = 'loaded';
            };
            probe.onerror = () => {
                if (token === loadToken) imageStatus.value = 'error';
            };
            probe.src = url;
        },
        { immediate: true },
    );

    const source = computed<CoverSource>(() => {
        const cover = parsed.value;
        if (cover.kind === 'classical') return cover;
        if (imageStatus.value === 'loaded') return cover;

        return {
            kind: 'classical',
            color: imageStatus.value === 'error' ? ERROR_COVER_COLOR : LOADING_COVER_COLOR,
        };
    });

    /** 供 book-wrap 兜底：预加载成功但真实渲染仍失败时降级 */
    function markImageFailed() {
        imageStatus.value = 'error';
    }

    return { source, imageStatus, markImageFailed };
}