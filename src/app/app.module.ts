import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { HeaderComponent } from './home-layout/header/header.component';
import { RadarChartComponent } from './radar-chart/radar-chart.component';
import { MapComponent } from './map/map.component';
import { BarchartVotesComponent } from './barchart-votes/barchart-votes.component';
import { StorypageComponent } from './storypage/storypage.component';
import { ZonesComponent } from './storypage/zones/zones.component';
import { StoryHomeComponent } from './storypage/story-home/story-home.component';
import { PartiesComponent } from './storypage/parties/parties.component';
import { CorrelationsComponent } from './storypage/correlations/correlations.component';
import { PartyArcDiagramComponent } from './party-arc-diagram/party-arc-diagram.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeLayoutComponent,
    HeaderComponent,
    RadarChartComponent,
    MapComponent,
    BarchartVotesComponent,
    StorypageComponent,
    ZonesComponent,
    StoryHomeComponent,
    PartiesComponent,
    CorrelationsComponent,
    PartyArcDiagramComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
