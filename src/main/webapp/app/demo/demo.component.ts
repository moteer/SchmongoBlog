import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';

import {BlogEntryService} from "../entities/blog-entry";
import {BlogService} from "../entities/blog";

import {Account, LoginModalService, Principal} from '../shared';
import {BlogEntry} from "../entities/blog-entry";
import {Blog} from "../entities/blog";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

@Component({
    selector: 'demo',
    templateUrl: './demo.component.html',
    styleUrls: [
        'demo.scss'
    ]

})
export class DemoComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    blog: Blog;
    blogEntries: BlogEntry[];


    constructor(private principal: Principal,
                private loginModalService: LoginModalService,
                private eventManager: JhiEventManager,
                private jhiAlertService: JhiAlertService,
                private blogService: BlogService,
                private blogEntryService: BlogEntryService
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        this.loadBlog();
        this.loadBlogEntries();
    }

    private loadBlog() {
    }

    private loadBlogEntries() {
        this.blogEntryService.query().subscribe(
            (res: HttpResponse<BlogEntry[]>) => {
                this.blogEntries = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }


    /*loadBlog() {
        this.latestBlog = this.blogs[0];
        console.log(this.latestBlog.pictureContentType);
        console.log(this.latestBlog.picture);

        this.imageUrl = 'data:' + this.latestBlog.pictureContentType + ';base64,' + this.latestBlog.picture;
        console.log("*************************************************************************************");
        console.log('data:' + this.latestBlog.pictureContentType + ';base64,' + this.latestBlog.picture);
    }*/

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    createImageUrlFor(blogEntry: BlogEntry) : string {
        return 'data:' + blogEntry.pictureContentType + ';base64,' + blogEntry.picture;
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
