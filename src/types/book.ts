// import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';


export interface Book {
    BookId: number;
    BookName: string;
    CoverImg: string;
    Author: string;
    FontFamily: string;
    FontSize: number;
    Index: Chapter[];
    // data?: DescData[];
}

export interface Chapter {
    Title: string;
    OrderNum: number;
    IndexId: number;
    Content?: string;
    IsHasContent?: boolean;
    Book?: Book;
    BookId?: number;
}

/**
 * 章节状态
 */
export interface ChapterStatus {
    /**
     * 是否已选
     */
    isCheck: boolean;
    /**
     * 是否已有正文
     */
    isHasContent: boolean;
    /**
     * 是否更新失败了
     */
    isError: boolean;
}


/**
 * 图书来源类型
 */
export interface BookSources {
    Path: string;
}

/**
 * 章节排序设置
 */
export interface ChapterOrderSetting {
    indexId:number,
    newOrder:number
}