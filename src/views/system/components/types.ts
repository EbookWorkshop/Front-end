import type { Component } from 'vue'

export type SettingFormType = {
    dataId: string;
    title: string;
    description?: string;
    status?: string;
    controlType: 'VNode' | 'select' | 'switch' | 'number' | 'color' | 'text' | 'password' | 'button';
    message?: string;

    /***************************************************/
    /** select/switch 选项列表 */
    options?: Array<{ label: string, value: any }>;

    /** button 按钮文本 */
    buttonText?: string;
    callback?: () => void;
}