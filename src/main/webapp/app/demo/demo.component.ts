import {Component, OnInit} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {Account, LoginModalService, Principal} from '../shared';

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
    imageUrl: String = "";

    constructor(private principal: Principal,
                private loginModalService: LoginModalService,
                private eventManager: JhiEventManager) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
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

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
