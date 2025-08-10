import { Routes } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { authGuard } from "../../guards/auth.guard";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AddProductComponent } from "../add-product/add-product.component";

export const adminRoutes: Routes = [
  {
    path: "",
    component: AdminDashboardComponent,
    canActivate: [authGuard],
     children: [
      { path: "", component: DashboardComponent }, // Default admin dashboard
      {
    path: "add-product",
    component: AddProductComponent,
    canActivate:[authGuard]
  },
     ]
  }
];