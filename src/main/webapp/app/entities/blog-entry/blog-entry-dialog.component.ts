import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { BlogEntry } from './blog-entry.model';
import { BlogEntryPopupService } from './blog-entry-popup.service';
import { BlogEntryService } from './blog-entry.service';

@Component({
    selector: 'jhi-blog-entry-dialog',
    templateUrl: './blog-entry-dialog.component.html'
})
export class BlogEntryDialogComponent implements OnInit {

    blogEntry: BlogEntry;
    isSaving: boolean;
    dateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private blogEntryService: BlogEntryService,
        private elementRef: ElementRef,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.blogEntry, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.blogEntry.id !== undefined) {
            this.subscribeToSaveResponse(
                this.blogEntryService.update(this.blogEntry));
        } else {
            this.subscribeToSaveResponse(
                this.blogEntryService.create(this.blogEntry));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<BlogEntry>>) {
        result.subscribe((res: HttpResponse<BlogEntry>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: BlogEntry) {
        this.eventManager.broadcast({ name: 'blogEntryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-blog-entry-popup',
    template: ''
})
export class BlogEntryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private blogEntryPopupService: BlogEntryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.blogEntryPopupService
                    .open(BlogEntryDialogComponent as Component, params['id']);
            } else {
                this.blogEntryPopupService
                    .open(BlogEntryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
