import type { Routes } from "@angular/router"
import { ContactComponent } from "./pages/contact/contact.component"
import { AddProductComponent } from "./pages/add-product/add-product.component"
import { authGuard } from "./guards/auth.guard"
import { AdminDashboardComponent } from "./pages/admin-dashboard/admin-dashboard.component"

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "products",
    loadComponent: () => import("./pages/products/products.component").then((m) => m.ProductsComponent),
  },
  {
    path: "products/:id",
    loadComponent: () =>
      import("./pages/product-detail/product-detail.component").then((m) => m.ProductDetailComponent),
  },
  {
    path: "cart",
    loadComponent: () => import("./pages/cart/cart.component").then((m) => m.CartComponent),
  },
  {
    path: "contact",
    component: ContactComponent
    // loadComponent: () => import("./pages/contact/contact.component").then((m) => m.ContactComponent),
  },
  {
    path: "checkout",
    loadComponent: () => import("./pages/checkout/checkout.component").then((m) => m.CheckoutComponent),
  },
   {
    path: "login",
    loadComponent: () => import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "otp",
    loadComponent: () => import("./pages/otp/otp.component").then((m) => m.OtpComponent),
  },
   {
    path: "check-out",
    loadComponent: () => import("./pages/checkout/checkout.component").then((m) => m.CheckoutComponent),
  },
  
  {
  path: "admin-dashboard",
  loadChildren: () =>
    import("./pages/admin-dashboard/dashboard.routes").then(m => m.adminRoutes)
},
  {
    path: "**",
    redirectTo: "",
  },
]
