
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
}

export interface OneChapterStatus {
    //出错的书ID
    bookid: number,
    //出错的章节ID
    chapterId: number,
    //错误信息
    err?: Error,
}