import { Route } from '@angular/router';

import { BlogViewComponent } from './';

export const BLOG_VIEW_ROUTE: Route = {
    path: 'blog-view/:id',
    component: BlogViewComponent,
    data: {
        authorities: [],
        pageTitle: 'undlos'
    }
};
