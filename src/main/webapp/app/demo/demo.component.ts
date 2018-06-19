import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';

import {BlogEntryService} from '../entities/blog-entry';
import {BlogService} from '../entities/blog';

import {Account, LoginModalService, Principal} from '../shared';
import {BlogEntry} from '../entities/blog-entry';
import {Blog} from '../entities/blog';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Params} from '@angular/router'
import {DomSanitizer, SafeValue} from "@angular/platform-browser";
import {SafeHtml} from "@angular/platform-browser/src/security/dom_sanitization_service";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'jhi-demo',
    templateUrl: './demo.component.html',
    styleUrls: [
        'demo.scss'
    ], inputs: [
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
    currentBlogEntryText: SafeHtml;
    currentImageGalleryUrls: any;
    currentBlogEntryGalleryUrls: SafeValue[] = [];
    isNavbarCollapsed: boolean;

    isOverview = true;
    @Output()
    adminButtonToggled: EventEmitter<boolean> = new EventEmitter<boolean>();



    constructor(private principal: Principal,
                private loginModalService: LoginModalService,
                private eventManager: JhiEventManager,
                private jhiAlertService: JhiAlertService,
                private blogService: BlogService,
                private blogEntryService: BlogEntryService,
                private activatedRoute: ActivatedRoute,
                private domSanitizer: DomSanitizer,
                private http: HttpClient
    ) {
        this.isNavbarCollapsed = true;

        this.activatedRoute.queryParams.subscribe((params: Params) => {
            console.log(params);
            if (params.admin && params.admin === "Erik") {
                this.toggleAdmin();
            }
        });
    }

    ngOnInit() {
        this.loadBlogEntries();
        //Todo: add image gallery functionality
        //this.loadImageUrls();
    }

    /**
     * Todo: extract to service or resource
     */
    private loadBlogEntries() {
        this.blogEntryService.query().subscribe(
            (res: HttpResponse<BlogEntry[]>) => {
                this.blogEntries = res.body;
                this.assignEvenAndOddBlogEntries();
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    /**
     * Todo: extract to service or resource
     */
    private loadImageUrls() {
        this.http.get<string[]>('api/imageurls', { params: {}, observe: 'response' })
            .subscribe(
                data => {
                    console.log(data.body);
                    this.currentImageGalleryUrls = data.body;
                    console.log(data);
                },
                err => console.log(err)
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
        this.currentBlogEntryText = this.trustHtml(this.currentBlogEntry.text)
        this.currentImageGalleryUrls.zuerich.forEach(url => this.currentBlogEntryGalleryUrls.push(this.trustUrl(url)));

        console.log(this.currentBlogEntryGalleryUrls);
    }

    showHomePage() {
        this.isOverview = true;
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    trustHtml(text: string) {
        return this.domSanitizer.bypassSecurityTrustHtml(text);
    }

    trustUrl(url: string) {
        return this.domSanitizer.bypassSecurityTrustUrl(url)
    }
}
