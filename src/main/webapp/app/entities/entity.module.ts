import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SchmongoBlogBlogModule } from './blog/blog.module';
import { SchmongoBlogBlogEntryModule } from './blog-entry/blog-entry.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        SchmongoBlogBlogModule,
        SchmongoBlogBlogEntryModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SchmongoBlogEntityModule {}
