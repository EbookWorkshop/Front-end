import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';


export interface Chapter {
    Title: string;
    OrderNum: number;
    IndexId: number;
    Content?: string;
    IsHasContent?: boolean;
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