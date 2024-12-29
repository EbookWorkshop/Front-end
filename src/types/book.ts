import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';


export interface Chapter {
    Title: string;
    OrderNum: number;
    IndexId: number;
    Content?: string;
    IsHasContent?: boolean;
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

export interface Book {
    BookId: number;
    BookName: string;
    CoverImg: string;
    Author: string;
    Index: Chapter[];
    data?: DescData[];
}


/**
 * 图书来源类型
 */
export interface BookSources {
    Path: string;
}

