import { Component } from '@angular/core';
import {
  CtaSectionComponent,
  FeaturesSectionComponent,
  FooterSectionComponent,
  HeroSectionComponent,
  PricesSectionComponent,
  StatsSectionComponent,
} from './components';

@Component({
  selector: 'app-home',
  imports: [
    HeroSectionComponent,
    FeaturesSectionComponent,
    FooterSectionComponent,
    CtaSectionComponent,
    PricesSectionComponent,
    StatsSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
