import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocsService } from './../../services/docs.service';
import { DocsForm, DocsInput } from './../../interfaces/docs.interfaces';
import { HttpClient, HttpParams, HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';

declare const saveAs: (blob: Blob, content: string) => void;

@Component({
  selector: 'app-laboratory',
  templateUrl: './laboratory.component.html',
  styleUrls: ['./laboratory.component.css']
})
export class LaboratoryComponent {

  model = { title: "新的模块名称", forms: [] }

  form: DocsForm = {
    title: '这是一个新接口',
    description: '接口的描述信息',
    url: '/model/operation/method',
    method: 'get',
    inputs: []
  }

  @ViewChild('successModal') successModal: any
  @ViewChild('errorModal') errorModal: any

  showSucces = false

  showError = false

  error = new HttpErrorResponse({})

  success = {}

  constructor(private activatedRoute: ActivatedRoute, private docsService: DocsService, private httpClient: HttpClient) { }

  ngOnInit() { }

  addInput() {
    this.form.inputs.push({ type: 'text', name: '', description: '' })
  }

  deleteInput(i: number) {
    this.form.inputs.splice(i, 1)
  }

  tryApi(form: NgForm) {

    switch (this.form.method) {
      case 'get': {
        this.httpClient.get(this.docsService.config.server + this.form.url, { params: this.getHttpParams(form.value), headers: this.getHttpHeaders() }).subscribe(res => this.showSuccessPad(res), error => this.showErrorPad(error))
        break
      }
      case 'post': {
        this.httpClient.post(this.docsService.config.server + this.form.url, form.value, { headers: this.getHttpHeaders() }).subscribe(res => this.showSuccessPad(res), error => this.showErrorPad(error))
        break
      }
      case 'put': {
        this.httpClient.put(this.docsService.config.server + this.form.url, form.value, { headers: this.getHttpHeaders() }).subscribe(res => this.showSuccessPad(res), error => this.showErrorPad(error))
        break
      }
      case 'delete': {
        this.httpClient.delete(this.docsService.config.server + this.form.url, { params: this.getHttpParams(form.value), headers: this.getHttpHeaders() }).subscribe(res => this.showSuccessPad(res), error => this.showErrorPad(error))
        break
      }
      default: {
        this.httpClient.get(this.docsService.config.server + this.form.url, { params: this.getHttpParams(form.value), headers: this.getHttpHeaders() }).subscribe(res => this.showSuccessPad(res), error => this.showErrorPad(error))
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

  getHttpHeaders(): HttpHeaders {
    let httpHeaders = new HttpHeaders()
    if (this.docsService.config && this.docsService.config.headers) {
      this.docsService.config.headers.forEach(header => {
        httpHeaders = httpHeaders.set(header, localStorage.getItem(header) || '')
      })
    }
    return httpHeaders
  }

  showErrorPad(error: HttpErrorResponse) {
    this.errorModal.open()
    this.error = error
    setTimeout(_ => {
      console.log('接口调用失败')
      console.log(this.error)
      let iframe = <HTMLIFrameElement>document.getElementById('error-html')
      iframe.contentWindow.document.body.innerHTML = error.error
    }, 100)
  }

  showSuccessPad(datas: any) {
    this.successModal.open()
    this.success = datas
  }

  consoleData() {
    console.log(this.success)
  }

  getJSON(jsonStr: string) {
    let json = {}
    try {
      json = JSON.parse(jsonStr)
    }
    catch (e) {
      json = { error: "不是合法的JSON串", string: jsonStr }
    }
    return json
  }

  appenToModel() {
    this.model.forms.push({ title: this.form.title, description: this.form.description, url: this.form.url, method: this.form.method, inputs: this.arrayCopy(this.form.inputs) })
  }

  removeForm(index: number) {
    this.model.forms.splice(index, 1)
  }

  arrayCopy(array: DocsInput[]) {
    let temp = new Array<DocsInput>()
    array.forEach(e => {
      temp.push({ type: e.type, name: e.name, description: e.description })
    })
    return temp
  }

  cleanForm() {
    this.form = {
      title: '这是一个新接口',
      description: '接口的描述信息',
      url: '/model/operation/method',
      method: 'get',
      inputs: []
    }
  }

  downloadFile() {
    console.log(window)
    var blob = new Blob([JSON.stringify(this.model)], { type: "text/plain;charset=utf-8" });
    saveAs(blob, this.model.title + ".json");
  }

  cleanModel() {
    this.model = { title: "新的模块名称", forms: [] }
  }

}
