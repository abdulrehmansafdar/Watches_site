import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionLogoFacebook, ionLogoTwitter, ionLogoInstagram } from '@ng-icons/ionicons';
import { heroEnvelope, heroPhone, heroMapPin } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, NgIcon],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  viewProviders: [provideIcons({
    heroEnvelope,
    heroPhone,
    heroMapPin,
    ionLogoFacebook,
    ionLogoTwitter,
    ionLogoInstagram
  })]
})
export class FooterComponent {
  constructor() {}
}
 
