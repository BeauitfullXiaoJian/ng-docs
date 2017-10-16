import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocsService } from './../../services/docs.service';
import { DocsForm } from './../../interfaces/docs.interfaces';
import { HttpClient, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.css']
})
export class ViewComponent {

    @ViewChild('successModal') successModal: any
    @ViewChild('errorModal') errorModal: any

    showSucces = false

    showError = false

    error = new HttpErrorResponse({})

    success = {}

    form: DocsForm = {
        title: '',
        description: '',
        url: '',
        method: '',
        inputs: []
    }

    constructor(private activatedRoute: ActivatedRoute, private docsService: DocsService, private httpClient: HttpClient) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe(res => {
            this.docsService.ready.next(_ => {
                this.form = this.docsService.models[res.model].forms[res.form]
            })
        })
    }

    addInput() {
        this.form.inputs.push({ type: 'text', name: '', description: '' })
    }

    deleteInput(i: number) {
        this.form.inputs.splice(i, 1)
    }

    tryApi(form: NgForm) {

        switch (this.form.method) {
            case 'get': {
                this.httpClient.get(this.docsService.config.server + this.form.url, { params: this.getHttpParams(form.value) }).subscribe(res => this.showSuccessPad(res), error => this.showErrorPad(error))
                break
            }
            case 'post': {
                this.httpClient.post(this.docsService.config.server + this.form.url, form.value).subscribe(res => this.showSuccessPad(res), error => this.showErrorPad(error))
                break
            }
            case 'put': {
                this.httpClient.put(this.docsService.config.server + this.form.url, form.value).subscribe(res => this.showSuccessPad(res), error => this.showErrorPad(error))
                break
            }
            case 'delete': {
                this.httpClient.delete(this.docsService.config.server + this.form.url, { params: this.getHttpParams(form.value) }).subscribe(res => this.showSuccessPad(res), error => this.showErrorPad(error))
                break
            }
            default: {
                this.httpClient.get(this.docsService.config.server + this.form.url, { params: this.getHttpParams(form.value) }).subscribe(res => this.showSuccessPad(res), error => this.showErrorPad(error))
            }
        }
    }

    getHttpParams(params: Object): HttpParams {
        let httpParams = new HttpParams()
        for (let key in params) {
            httpParams = httpParams.set(key, params[key])
        }
        return httpParams
    }

    showErrorPad(error: HttpErrorResponse) {
        this.errorModal.open()
        this.error = error
        setTimeout(_ => {
            let iframe = <HTMLIFrameElement>document.getElementById('error-html')
            iframe.contentWindow.document.body.innerHTML = error.error
        }, 100)
    }

    showSuccessPad(datas: any) {
        this.successModal.open()
        this.success = datas
    }

    getJSON(jsonStr: string) {
        let json = {}
        try {
            json = JSON.parse(jsonStr)
        }
        catch{

        }
        return json
    }

}
