import { Route } from '@angular/router';

import { LandingComponent } from './';

export const LANDING_ROUTE: Route = {
    path: '',
    component: LandingComponent,
    data: {
        authorities: [],
        pageTitle: 'undlos'
    }
};
