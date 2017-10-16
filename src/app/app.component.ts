import { Component } from '@angular/core';
import { DocsService } from './services/docs.service';
import { TaskQuery, Task } from './classes/task.class';
import { DocsConfig } from './interfaces/docs.interfaces';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  config = {}

  constructor(private docsService: DocsService) {  }

  ngOnInit() {

    const taskQuery = new TaskQuery()

    taskQuery.push(new Task(handle => {
      this.docsService.loadConfig(handle)
    }))

    taskQuery.push(new Task(handle => {
      this.docsService.loadModel(handle)
    }))

    taskQuery.run()

    taskQuery.ready(_ => {
      this.docsService.loaded = true
      this.docsService.readyHandle.ready()
      this.config = this.docsService.config
    })

  }

}
