import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// Angular Material Libraries
import { MatToolbarModule } from "@angular/material/toolbar";
import { CalendarComponent } from "./calendar/calendar.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
  declarations: [AppComponent, CalendarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatGridListModule,
    MatSelectModule
  ],
  exports: [MatToolbarModule, MatGridListModule, MatSelectModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
