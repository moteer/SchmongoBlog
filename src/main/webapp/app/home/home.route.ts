import { Route } from '@angular/router';

import { HomeComponent } from './';

export const HOME_ROUTE: Route = {
    path: 'admin',
    component: HomeComponent,
    data: {
        authorities: [],
        pageTitle: 'SchmongoBlog'
    }
};
