import {
  FeaturesSectionComponent,
  FooterSectionComponent,
} from '@/components/home';
import { HeroSectionComponent } from '@/components/home/hero-section/hero-section.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [
    HeroSectionComponent,
    FeaturesSectionComponent,
    FooterSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
