import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';

import {BlogEntryService} from '../entities/blog-entry';
import {BlogService} from '../entities/blog';

import {Account, LoginModalService, Principal} from '../shared';
import {BlogEntry} from '../entities/blog-entry';
import {Blog} from '../entities/blog';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

@Component({
    selector: 'jhi-demo',
    templateUrl: './demo.component.html',
    styleUrls: [
        'demo.scss'
    ]

})
export class DemoComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    blog: Blog;
    blogEntries: BlogEntry[] = [{id: 'id', title: 'title'}];
    evenBlogEntries: BlogEntry[] = [];
    oddBlogEntries: BlogEntry[] = [];

    currentBlogEntry: BlogEntry;

    isOverview = true;
    @Output()
    adminButtonToggled: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private principal: Principal,
                private loginModalService: LoginModalService,
                private eventManager: JhiEventManager,
                private jhiAlertService: JhiAlertService,
                private blogService: BlogService,
                private blogEntryService: BlogEntryService) {
    }

    ngOnInit() {
        this.loadBlog();
        this.loadBlogEntries();
    }

    private loadBlog() {
    }

    private loadBlogEntries() {
        this.blogEntryService.query().subscribe(
            (res: HttpResponse<BlogEntry[]>) => {
                this.blogEntries = res.body;
                this.assignEvenAndOddBlogEntries();
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private assignEvenAndOddBlogEntries() {
        for (let i = 0; i < this.blogEntries.length; i++) {
            if (i % 2 === 0) {
                this.evenBlogEntries.push(this.blogEntries[i]);
            } else {
                this.oddBlogEntries.push(this.blogEntries[i]);
            }
        }
    }


    createImageUrlFor(blogEntry: BlogEntry): string {
        return 'data:' + blogEntry.pictureContentType + ';base64,' + blogEntry.picture;
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    toggleAdmin() {
        this.adminButtonToggled.emit(true);
    }

    showBlogEntry(blogEntry: BlogEntry) {
        this.isOverview = false;
        this.currentBlogEntry = blogEntry;
    }
}
