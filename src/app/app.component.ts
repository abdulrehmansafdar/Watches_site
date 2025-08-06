import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"

import { FooterComponent } from "./components/footer/footer.component"
import { HeaderComponent } from "./components/header/header.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { LoaderService } from "./services/loader.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FooterComponent,HeaderComponent,LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Watches_site';
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

}
