import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from './../configs/path.config';
import { DocsConfig, DocsModel } from './../interfaces/docs.interfaces';
import { Task, TaskHandle } from './../classes/task.class';

@Injectable()
export class DocsService {

    ready: Task

    readyHandle: TaskHandle

    loaded = false

    config: any = {}

    models: DocsModel[] = new Array<DocsModel>()

    constructor(private httpClient: HttpClient) {
        this.ready = new Task(handle => {
            this.readyHandle = handle
            if (this.loaded) handle.ready()
        })
    }

    loadConfig(handle: TaskHandle) {

        this.httpClient.get(API_PATH.config).subscribe(res => {
            this.config = <DocsConfig>res
            handle.ready(res)
            console.log('配置文件载入成功')
        }, error => {
            console.error(error)
            console.log('配置文件载入失败')
        })
    }

    loadModel(handle: TaskHandle) {

        const config = <DocsConfig>this.config

        let cx = 0;

        for (let i = 0; i < config.docs.length; i++) {
            this.httpClient.get(API_PATH.docs + config.docs[i]).subscribe(res => {
                this.models[i] = <DocsModel>res
                console.log(config.docs[i] + "载入成功")
                cx++;
                if (cx >= config.docs.length) {
                    handle.ready(this.models)
                }
            }, error => {
                console.error(error)
                console.log(config.docs[i] + '文件载入失败')
                cx++;
                if (cx >= config.docs.length) {
                    handle.ready(this.models)
                }
            })
        }
    }

}