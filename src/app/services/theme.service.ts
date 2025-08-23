import { Injectable ,Inject,PLATFORM_ID} from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { BehaviorSubject } from "rxjs"
import Swal from 'sweetalert2'
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
  shownotification(message: string, type: 'success' | 'error' = 'success',) {
    Swal.fire({
      theme: this.isDarkMode.value ? 'dark' : 'light',
      title: type === 'success' ? 'Success' : 'Error',
      text: message,
      icon: type,
      timer: 3000,
      showConfirmButton: false,
      position: 'top-end',
      confirmButtonText: 'OK'
    });
  }
  confirmationModal(type: string, onConfirm: () => void) {
    Swal.fire({
      theme: this.isDarkMode.value ? 'dark' : 'light',
      title: `Are you sure to delete ${type}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
       
      }
    });
  }
  showCartToast(message: string, onViewCart?: () => void) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: message,
    showConfirmButton: true,
    confirmButtonText: 'View Cart',
    timer: 5000,
    timerProgressBar: true,
    background: this.isDarkMode.value ? '#222' : '#fff',
    color: this.isDarkMode.value ? '#fff' : '#222',
    customClass: {
      popup: 'swal2-cart-toast'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  }).then((result) => {
    if (result.isConfirmed && onViewCart) {
      onViewCart();
    }
  });
}
}
