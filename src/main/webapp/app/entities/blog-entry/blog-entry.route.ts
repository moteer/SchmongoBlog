import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { BlogEntryComponent } from './blog-entry.component';
import { BlogEntryDetailComponent } from './blog-entry-detail.component';
import { BlogEntryPopupComponent } from './blog-entry-dialog.component';
import { BlogEntryDeletePopupComponent } from './blog-entry-delete-dialog.component';

export const blogEntryRoute: Routes = [
    {
        path: 'blog-entry',
        component: BlogEntryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BlogEntries'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'blog-entry/:id',
        component: BlogEntryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BlogEntries'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const blogEntryPopupRoute: Routes = [
    {
        path: 'blog-entry-new',
        component: BlogEntryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BlogEntries'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'blog-entry/:id/edit',
        component: BlogEntryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BlogEntries'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'blog-entry/:id/delete',
        component: BlogEntryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BlogEntries'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
