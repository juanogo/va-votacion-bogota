import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { HeaderComponent } from './home-layout/header/header.component';
import { RadarChartComponent } from './radar-chart/radar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeLayoutComponent,
    HeaderComponent,
    RadarChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
