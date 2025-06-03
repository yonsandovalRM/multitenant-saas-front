import { Component } from '@angular/core';
import {
  CtaSectionComponent,
  FeaturesSectionComponent,
  FooterSectionComponent,
  HeroSectionComponent,
  PricingSectionComponent,
  StatsSectionComponent,
} from './components';

@Component({
  selector: 'app-home',
  imports: [
    HeroSectionComponent,
    FeaturesSectionComponent,
    FooterSectionComponent,
    CtaSectionComponent,
    PricingSectionComponent,
    StatsSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
