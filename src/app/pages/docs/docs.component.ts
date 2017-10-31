import { Component, OnInit } from '@angular/core';
import { DocsService } from './../../services/docs.service';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {

  config: any = {}

  models: any[] = []

  constructor(private docsService: DocsService) { }

  ngOnInit() {
    this.docsService.ready.next(_ => {
      this.models = this.docsService.models
      this.config = this.docsService.config
    })
  }


}
