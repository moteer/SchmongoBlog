import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SchmongoBlogSharedModule} from '../shared';

import {BLOG_VIEW_ROUTE} from './';
import {HttpClientModule} from "@angular/common/http";
import {CloudImageService} from "../cloud/cloud-image.service";

@NgModule({
    imports: [
        SchmongoBlogSharedModule,
        RouterModule.forChild([BLOG_VIEW_ROUTE]),
        HttpClientModule
    ],
    declarations: [
    ],
    entryComponents: [],
    providers: [
        CloudImageService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BlogViewModule {
}
