import {Component, OnInit, AfterViewInit} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';

import {BlogEntryService} from '../entities/blog-entry';
import {BlogService} from '../entities/blog';

import {Account, LoginModalService, Principal} from '../shared';
import {BlogEntry} from '../entities/blog-entry';
import {Blog} from '../entities/blog';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router'
import {DomSanitizer, SafeValue} from "@angular/platform-browser";
import {SafeHtml} from "@angular/platform-browser/src/security/dom_sanitization_service";
import {HttpClient} from "@angular/common/http";
import {CloudImageService} from "../cloud/cloud-image.service";

@Component({
    selector: 'jhi-blog-view',
    templateUrl: './blog-view.component.html',
    styleUrls: [
        'blog-view.scss'
    ], inputs: [
    ]

})
export class BlogViewComponent implements OnInit, AfterViewInit {

    account: Account;
    modalRef: NgbModalRef;
    blog: Blog;
    blogEntries: BlogEntry[] = [{id: 'id', title: 'title'}];

    evenCategoryTravelBlogEntries: BlogEntry[] = [];
    oddCategoryTravelBlogEntries: BlogEntry[] = [];
    categoryEarlyTravelBlogEntries: BlogEntry[] = [];
    evenCategoryInspirationBlogEntries: BlogEntry[] = [];
    oddCategoryInspirationBlogEntries: BlogEntry[] = [];
    categoryWhoWeAreBlogEntries: BlogEntry[] = [];

    currentBlogEntry: BlogEntry;
    currentBlogEntryText: SafeHtml;
    imageUrls: any;
    currentBlogEntryGalleryUrls: SafeValue[] = [];

    isOverview = true;
    isGallery = false;

    slideIndex = 1;

    blogEntry: BlogEntry;

    constructor(private principal: Principal,
                private loginModalService: LoginModalService,
                private eventManager: JhiEventManager,
                private jhiAlertService: JhiAlertService,
                private blogService: BlogService,
                private blogEntryService: BlogEntryService,
                private activatedRoute: ActivatedRoute,
                private domSanitizer: DomSanitizer,
                private http: HttpClient,
                private cloudImageService: CloudImageService
    ) {}

    ngOnInit() {
        console.debug("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.debug("load blog view ...");

        this.imageUrls = this.cloudImageService.loadImageUrls();
        console.log("WO SIND DIE IMAGE URLS ???????");
        console.debug(this.imageUrls);

        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.blogEntryService.find(id)
            .subscribe(response => {
                console.log("show current blogentry ...................");
                console.dir(response.body);

                this.blogEntry = response.body;
                this.showBlogEntry(this.blogEntry);
            });

    }

    ngAfterViewInit(): void {
        window.scrollTo(0, 0);
        console.debug("After View Init");
        if (!this.isOverview) {
            let myModal = document.getElementById('myModal');
            if (myModal != null) {
                myModal.scrollIntoView();
                myModal = null;
            }
        }
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

    private assignEvenAndOddBlogEntries() {

        for (let i = 0; i < this.blogEntries.length; i++) {
            if (i % 2 === 0) {
                if (this.blogEntries[i].category === "travel") {
                    this.evenCategoryTravelBlogEntries.push(this.blogEntries[i]);
                } else if (this.blogEntries[i].category === "earlyTravel") {
                    this.categoryEarlyTravelBlogEntries.push(this.blogEntries[i]);
                } else if (this.blogEntries[i].category === "inspiration") {
                    this.evenCategoryInspirationBlogEntries.push(this.blogEntries[i]);
                }

            } else {
                if (this.blogEntries[i].category === "travel") {
                    this.oddCategoryTravelBlogEntries.push(this.blogEntries[i]);
                } else if (this.blogEntries[i].category === "earlyTravel") {
                    this.categoryEarlyTravelBlogEntries.push(this.blogEntries[i]);
                } else if (this.blogEntries[i].category === "inspiration") {
                    this.oddCategoryInspirationBlogEntries.push(this.blogEntries[i]);
                }
            }

            if (this.blogEntries[i].category === "whoweare") {
                this.categoryWhoWeAreBlogEntries.push(this.blogEntries[i]);
            }
        }
    }


    createImageUrlFor(blogEntry: BlogEntry): string {
        console.debug("-----------> pictureContentType ########################################");
        console.dir(blogEntry);
        console.debug(blogEntry.title);
        console.debug(blogEntry.pictureContentType);
        return 'data:' + blogEntry.pictureContentType + ';base64,' + blogEntry.picture;
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    showBlogEntry(blogEntry: BlogEntry) {
        this.currentBlogEntry = blogEntry;

        console.debug("-----------> showBlogEntry ##############################################");
        console.dir(this.currentBlogEntry);

        this.currentBlogEntryText = this.trustHtml(this.currentBlogEntry.text);

        console.debug("-----------> set currentBlogEntryGalleryUrls to length 0 and display #####");
        this.currentBlogEntryGalleryUrls.length = 0;
        console.debug(this.currentBlogEntryGalleryUrls);

        console.debug("-----------> display imageUrls ###########################################");
        console.debug(this.imageUrls);

        console.debug("-----------> display currentBlogEntry.cloudDirectory  ####################");
        console.debug(this.currentBlogEntry.cloudDirectory);

        console.debug("-----------> set currentBlogEntryGalleryUrls to imageUrls and display ####");
        if (this.imageUrls[this.currentBlogEntry.cloudDirectory]) {

            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            console.dir(this.imageUrls);
            this.currentBlogEntryGalleryUrls = this.imageUrls[this.currentBlogEntry.cloudDirectory].slice();
        }
        console.debug(this.currentBlogEntryGalleryUrls);
    }

    trustHtml(text: string) {
        return this.domSanitizer.bypassSecurityTrustHtml(text);
    }

    trustUrl(url: string) {
        return this.domSanitizer.bypassSecurityTrustUrl(url)
    }

    openModal(){
        console.debug("open Modal");
        this.isGallery = true;
        let lightbox = document.getElementById('myModal');
        lightbox.style.display = "block";
        lightbox.scrollTo(0,0);
    }


    closeModal() {
        console.debug("close Modal");
        this.isGallery = false;
        document.getElementById('myModal').style.display = "none";
        this.showNavbar(true);

    }

    // Next/previous controls
    plusSlides(n) {
        let newSlideIndex = this.slideIndex += n;
        this.showSlides(newSlideIndex);
    }

    // Thumbnail image controls
    currentSlide(n) {
        this.slideIndex = n;
        this.showSlides(n);
    }

    showSlides(n) {
        console.debug("n: " + n);
        console.debug("slideIndex: " + this.slideIndex);
        this.showNavbar(false);
        console.debug(this.currentBlogEntryGalleryUrls);

        let slides = document.getElementsByClassName("mySlides");
        let dots = document.getElementsByClassName("landing");
        let captionText = document.getElementById("caption");
        if (n >= slides.length) {this.slideIndex = 0}
        if (n < 0) {this.slideIndex = slides.length}
        for (let i = 0; i < slides.length; i++) {
            slides[i]['style'].display = "none";
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        console.debug("this.slideIndex: " + this.slideIndex);
        console.debug("slides[this.slideIndex]['style']x: " + slides[this.slideIndex]['style']);

        slides[this.slideIndex]['style'].display = "block";
        dots[this.slideIndex].className += " active";
        captionText.innerHTML = dots[this.slideIndex]['alt'];
    }

    private showNavbar(show) {
        let navbar = document.getElementsByClassName("navbar");
        for (let i = 0; i < navbar.length; i++) {
            if (show) {
                navbar[i]['style'].display = "block";
            } else {
                navbar[i]['style'].display = "none";
            }
        }
    }
}
