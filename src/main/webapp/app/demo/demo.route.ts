import { Route } from '@angular/router';

import { DemoComponent } from './';

export const DEMO_ROUTE: Route = {
    path: 'demo',
    component: DemoComponent,
    data: {
        authorities: [],
        pageTitle: 'Blog demo!'
    }
};
