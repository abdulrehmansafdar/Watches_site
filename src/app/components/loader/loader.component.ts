import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [NgxSpinnerModule,CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoaderComponent {
  isDarkMode$: any
  constructor(
    public themeService: ThemeService,
  ) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }
}
