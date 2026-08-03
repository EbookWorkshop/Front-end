import { reactive, readonly } from 'vue';
import type { MessageRecord } from '@/types/Message';

// 使用 reactive 管理状态，属性直接可访问，TypeScript 推断更好
const state = reactive({
    currentMessage: null as MessageRecord | null,
    visible: false,
});

export function useMessageDetail() {
    const open = (message: MessageRecord) => {
        state.currentMessage = message;
        state.visible = true;
    };

    const close = () => {
        state.visible = false;
        setTimeout(() => {
            state.currentMessage = null;
        }, 300);
    };

    // 返回只读版本，防止外部直接修改
    return {
        state: readonly(state),
        open,
        close,
    };
}