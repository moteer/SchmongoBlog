import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SchmongoBlogSharedModule} from '../shared';

import {LANDING_ROUTE, LandingComponent} from './';
import {HttpClientModule} from "@angular/common/http";
import {CloudImageService} from "../cloud/cloud-image.service";

@NgModule({
    imports: [
        SchmongoBlogSharedModule,
        RouterModule.forChild([LANDING_ROUTE]),
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
export class SchmongoBlogLandingModule {
}
