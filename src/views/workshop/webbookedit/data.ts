
export enum WebBookStatus {
    /**
     * 单独一章失败
     * WebBook.UpdateOneChapter.Error
     */
    Error = 'WebBook.UpdateOneChapter.Error',
    /**
     * 单独某章完成
     * WebBook.Chapter.Update
     */
    Success = "WebBook.Chapter.Update",
    /**
     * 所有章节更新完成
     * WebBook.UpdateChapter.Finish
     */
    AllSuccess = "WebBook.UpdateChapter.Finish",

    /**
     * 章节进度更新
     */
    Update = "WebBook.UpdateChapter.Process",
}

/**
 * 用于 Scoket 发过来的消息
 */
export interface OneChapterStatus {
    /**
     * 属于书的ID
     */
    bookid: number,
    /**
     * 属于书的章节ID
     */
    chapterId: number,
    /**
     * 出错消息
     */
    err?: Error,
}