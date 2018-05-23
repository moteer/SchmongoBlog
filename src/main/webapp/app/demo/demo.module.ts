import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SchmongoBlogSharedModule } from '../shared';

import { DEMO_ROUTE, DemoComponent } from './';

@NgModule({
    imports: [
        SchmongoBlogSharedModule,
        RouterModule.forChild([ DEMO_ROUTE ])
    ],
    declarations: [
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SchmongoBlogDemoModule { }
