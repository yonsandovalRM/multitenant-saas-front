import { Component, inject } from '@angular/core';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ZapIcon,
  LucideAngularModule,
  ShieldIcon,
  CalendarIcon,
  ArrowRightIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-hero-section',
  imports: [NgxTypedJsModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
})
export class HeroSectionComponent {
  readonly ZapIcon = ZapIcon;
  readonly ShieldIcon = ShieldIcon;
  readonly CalendarIcon = CalendarIcon;
  readonly ArrowRightIcon = ArrowRightIcon;

  fb = inject(FormBuilder);

  form = this.fb.group({
    businessName: ['', [Validators.required, Validators.minLength(3)]],
  });

  handleSubmit() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);
    this.form.reset();
  }
}
