import { BaseEntity } from './../../shared';

export class Blog implements BaseEntity {
    constructor(
        public id?: string,
        public title?: string,
        public pictureContentType?: string,
        public picture?: any,
    ) {
    }
}
