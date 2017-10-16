import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { ClarityModule } from "clarity-angular";
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PrettyJsonModule, SafeJsonPipe } from 'angular2-prettyjson';
import { JsonPipe } from '@angular/common';

//public global service
import { DocsService } from './services/docs.service';

//app component
import { AppComponent } from "./app.component";

//page component list
import { ViewComponent } from './pages/view/view.component';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    PrettyJsonModule,
    NoopAnimationsModule,
    ClarityModule.forRoot(),
    RouterModule.forRoot([
      { path: 'view/:model/:form', component: ViewComponent }
    ])
  ],
  declarations: [
    AppComponent,
    ViewComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    DocsService,
    { provide: JsonPipe, useClass: SafeJsonPipe }
  ]
})
export class AppModule { }

