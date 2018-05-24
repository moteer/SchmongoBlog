import { BaseEntity } from './../../shared';

export class BlogEntry implements BaseEntity {
    constructor(
        public id?: string,
        public title?: string,
        public text?: string,
        public pictureContentType?: string,
        public picture?: any,
        public thumbnailContentType?: string,
        public thumbnail?: any,
        public date?: any,
        public shortDescription?: string,
        public picturesContentType?: string,
        public pictures?: any,
        public author?: string,
    ) {
    }
}
