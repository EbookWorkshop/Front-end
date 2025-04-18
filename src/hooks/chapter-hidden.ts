import { h } from 'vue';
import { listHiddenChapters, updateChapterVisibility } from '@/api/book';
import { ApiResultCode } from '@/types/global';
import type { HttpResponse } from '@/types/global';
import { Button, Message, Modal, Table } from '@arco-design/web-vue';

let myModal: any = null;
function showHiddenChapters(bookid: number) {
    listHiddenChapters(bookid).then(res => {
        // console.log(res);
        if (res.code != ApiResultCode.Success) {
            Message.error(`展示隐藏章节接口出错：${res.msg}`);
            return;
        }

        // 定义表格列
        const columns = [
            { title: '章节名称', dataIndex: 'title' },
            { title: '章节ID', dataIndex: 'chapterIndex' },
            {
                title: '操作',
                slotName: 'optional',
                width: 100
            }
        ];

        // 转换数据结构
        const data = res.data.map(item => ({
            key: item.IndexId,
            title: item.Title == "Sys_Introduction_Chapter" ? "简介" : item.Title,
            chapterIndex: item.IndexId,
            rawData: item // 保留原始数据
        }));

        myModal = Modal.info({
            title: '已隐藏章节',
            draggable: true,
            width: 'auto',
            content: () => h(Table, {
                columns,
                data,
            }, {
                // 添加操作列插槽
                optional: ({ record }: any) => h(Button, {
                    size: 'small',
                    type: 'primary',
                    onClick: () => setChapterShow(record.chapterIndex)
                }, () => '切换为显示')
            })
        });

    });
}

/**
 * 切换章节隐藏状态
 * @param {number} cid 章节ID
 */
function toggleChapterHidden(cid: number, ishide = true) {
    const actionName = ishide ? '隐藏' : '显示'
    return updateChapterVisibility(cid, ishide).then((result: HttpResponse<boolean>) => {
        if (result.code == ApiResultCode.Success) {
            Message.success(`已${actionName}章节`);
            myModal?.close();
        } else Message.error(`${actionName}章节失败：` + result.msg)
    }).catch(err => {
        Message.error(`${actionName}章节出错：` + err);
    })
}

function setChapterShow(chapterId: number) {
    toggleChapterHidden(chapterId, false)
}

export default function useChapterHiddenHelper() {
    return {
        showHiddenChapters,
        toggleChapterHidden
    }
};