<script lang="ts" setup>
import diffMatchPatch from 'diff-match-patch';
import { watch, ref } from 'vue';

const { DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL } = diffMatchPatch;

const props = defineProps<{
    left: string,
    right: string
}>();

const leftHtml = ref("");
const rightHtml = ref("");



// 监听props变化
watch([() => props.left, () => props.right], ([newLeft, newRight]) => {
    if (newLeft == newRight && newLeft == "") return;

    generateDiffHtml(newLeft, newRight);

}, { immediate: true });

function generateDiffHtml(left: string, right: string) {
    const dmp = new diffMatchPatch();
    dmp.Diff_EditCost = 4; // 调整编辑成本阈值//
    const diffs = dmp.diff_main(left, right);
    dmp.diff_cleanupSemantic(diffs); // 清理和优化差异

    // 生成左右两列的 HTML
    leftHtml.value = formatDiff(diffs, true);
    rightHtml.value = formatDiff(diffs, false);
}

function formatDiff(diffs: any[], isLeft: boolean) {
    let html = '';
    let currentOp: number = 0;
    let currentText = '';

    diffs.forEach(([op, text]: [number, string]) => {
        // 将特殊字符转义为 HTML 实体
        text = text.replace(/[&<>"']/g, (match: string) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[match] as string);

        if (op !== currentOp) {
            if (currentText !== '') {
                html += formatDiffPart(currentOp, currentText, isLeft);
                currentText = '';
            }
            currentOp = op;
        }
        currentText += text;
    });

    if (currentText !== '') {
        html += formatDiffPart(currentOp, currentText, isLeft);
    }

    return html;
}
function formatDiffPart(op: number, text: string, isLeft: boolean) {
    let style = '';
    if (op === DIFF_DELETE) {
        if (isLeft) {
            style = 'background-color: #ffe6e6; color: #d32f2f; text-decoration: line-through;';
        } else {
            style = 'visibility: hidden;';
        }
    } else if (op === DIFF_INSERT) {
        if (isLeft) {
            style = 'visibility: hidden;';
        } else {
            style = 'background-color: #e6ffe6; color: #2e7d32;';
        }
    } else if (op === DIFF_EQUAL) {
        style = '';
    }

    return `<div style="${style}">${text}</div>`;
}


// function compareTexts(left: string, right: string) {

//     const dmp = new diffMatchPatch();
//     // dmp.Diff_EditCost = 4; // 调整编辑成本阈值//
//     const diffs = dmp.diff_main(left, right);
//     dmp.diff_cleanupSemantic(diffs);

//     let leftContent = '';
//     let rightContent = '';

//     diffs.forEach(([op, text]) => {
//         if (op === -1 /*dmp.DIFF_DELETE*/) {
//             leftContent += `<del style="background-color: #ffe6e6; color: #d32f2f; text-decoration: line-through;">${text}</del>`;
//         } else if (op === 1 /* dmp.DIFF_INSERT*/) {
//             rightContent += `<ins style="background-color: #e6ffe6; color: #2e7d32;">${text}</ins>`;
//         } else if (op === 0 /*dmp.DIFF_EQUAL*/) {
//             leftContent += text;
//             rightContent += text;
//         }
//     });

//     leftHtml.value = leftContent;
//     rightHtml.value = rightContent;
// }

</script>

<template>
    <div class="diff-container">
        <div class="diff-side" >
            <div v-html="leftHtml" class="diff-content" style="border-right: 1px solid #ccc;"></div>
        </div>
        <div class="diff-side">
            <div v-html="rightHtml" class="diff-content" ></div>
        </div>
    </div>
</template>

<style>
.diff-container {
    display: flex;
    width: 100%;
    font-family: Arial, sans-serif;
}

.diff-side {
    flex: 1;
    padding: 10px;
}

.diff-content {
    white-space: pre-wrap;
    line-height: 1.5;
    padding-right: 15px;
}
</style>