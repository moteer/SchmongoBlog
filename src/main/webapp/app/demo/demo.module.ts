import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParallaxModule, ParallaxConfig} from 'ngx-parallax';

import { SchmongoBlogSharedModule } from '../shared';

import { DEMO_ROUTE, DemoComponent } from './';

@NgModule({
    imports: [
        ParallaxModule,
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
