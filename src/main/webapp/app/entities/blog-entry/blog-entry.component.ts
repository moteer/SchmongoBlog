import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { BlogEntry } from './blog-entry.model';
import { BlogEntryService } from './blog-entry.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-blog-entry',
    templateUrl: './blog-entry.component.html'
})
export class BlogEntryComponent implements OnInit, OnDestroy {
blogEntries: BlogEntry[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private blogEntryService: BlogEntryService,
        private jhiAlertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.blogEntryService.query().subscribe(
            (res: HttpResponse<BlogEntry[]>) => {
                this.blogEntries = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInBlogEntries();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: BlogEntry) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    registerChangeInBlogEntries() {
        this.eventSubscriber = this.eventManager.subscribe('blogEntryListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
