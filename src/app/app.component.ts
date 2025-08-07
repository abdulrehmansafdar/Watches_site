import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"

import { FooterComponent } from "./components/footer/footer.component"
import { HeaderComponent } from "./components/header/header.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { LoaderService } from "./services/loader.service";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { heroXMark, heroSparkles, heroTruck, heroGift, heroShieldCheck, heroClock } from "@ng-icons/heroicons/outline";
import { ionLogoInstagram, ionLogoWhatsapp } from "@ng-icons/ionicons";

interface TopPromotion {
  text: string;
  icon: string;
}
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FooterComponent, HeaderComponent, LoaderComponent, NgIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  viewProviders: [provideIcons({
    heroXMark,
    heroSparkles,
    heroTruck,
    heroGift,
    heroShieldCheck,
    heroClock,
    ionLogoInstagram,
    ionLogoWhatsapp
  })]
})
export class AppComponent implements OnInit {
  title = 'Watches_site';
  hideTopBanner = false;
  
  topPromotions: TopPromotion[] = [
    {
      text: "Free Shipping on Orders Over $500",
      icon: "heroTruck"
    },
    {
      text: "Limited Time: 20% Off All Luxury Watches",
      icon: "heroSparkles"
    },
    {
      text: "New Arrivals: Swiss Made Collection",
      icon: "heroGift"
    },
    {
      text: "2-Year Warranty on All Timepieces",
      icon: "heroShieldCheck"
    },
    {
      text: "Flash Sale: 48 Hours Only",
      icon: "heroClock"
    }
  ];

  ngOnInit() {
    // Any initialization logic can go here
  }
  
  constructor(
    private loaderService: LoaderService
  ) { 
    this.loaderService.show(); // Show loader on app initialization
    setTimeout(() => {
      this.loaderService.hide(); // Hide loader after 2 seconds
    }, 2000);
  }
  closeTopBanner() {
    this.hideTopBanner = true;
  }

}
