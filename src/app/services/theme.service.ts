import { Injectable ,Inject,PLATFORM_ID} from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false)
  isDarkMode$ = this.isDarkMode.asObservable()

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) 
  {
    this.initializeTheme()
  }

  private initializeTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark)
    this.setTheme(isDark)
    }
  }

  toggleTheme() {
    this.setTheme(!this.isDarkMode.value)
  }

  private setTheme(isDark: boolean) {
    this.isDarkMode.next(isDark)

    if (isPlatformBrowser(this.platformId)) {
      if (isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
    }
  }
}
