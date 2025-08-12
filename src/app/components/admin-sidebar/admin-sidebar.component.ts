import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroHome,
  heroSquares2x2,
  heroPlus,
  heroShoppingBag,
  heroCog6Tooth,
  heroUsers,
  heroChartBar,
  heroStar,
  heroArchiveBox,
  heroClipboardDocumentList,
  heroArrowLeftOnRectangle,
  heroChevronDown,
  heroChevronRight,
  heroBell,
  heroExclamationTriangle
} from '@ng-icons/heroicons/outline';

interface MenuItem {
  title: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  badge?: number;
  isExpanded?: boolean;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIcon],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  viewProviders: [provideIcons({
    heroHome,
    heroSquares2x2,
    heroPlus,
    heroShoppingBag,
    heroCog6Tooth,
    heroUsers,
    heroChartBar,
    heroStar,
    heroArchiveBox,
    heroClipboardDocumentList,
    heroArrowLeftOnRectangle,
    heroChevronDown,
    heroChevronRight,
    heroBell,
    
    heroExclamationTriangle
  })]
})
export class AdminSidebarComponent implements OnInit {
  isCollapsed = true;
  
  menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'heroHome',
      route: '/admin-dashboard'
    },
    {
      title: 'Product Management',
      icon: 'heroSquares2x2',
      isExpanded: false,
      children: [
        {
          title: 'All Products',
          icon: 'heroSquares2x2',
          route: '/products'
        },
        {
          title: 'Add Product',
          icon: 'heroPlus',
          route: '/admin-dashboard/add-product'
        },
        {
          // for managing categories and other things
          title: 'Admin Settings',
          icon: 'heroCog6Tooth',
          route: '/admin-dashboard/admin-management',
        },
        {
          title: 'Featured Products',
          icon: 'heroStar',
          route: '/admin-dashboard/featured-products'
        }
      ]
    },
    {
      title: 'Orders & Sales',
      icon: 'heroShoppingBag',
      isExpanded: false,
      children: [
        {
          title: 'All Orders',
          icon: 'heroShoppingBag',
          route: '/admin-dashboard/orders'
        },
        {
          title: 'Purchase Requests',
          icon: 'heroClipboardDocumentList',
          route: '/admin-dashboard/purchase-requests',
          badge: 12 // Pending requests count
        },
        {
          title: 'Sales Analytics',
          icon: 'heroChartBar',
          route: '/admin-dashboard/sales-analytics'
        }
      ]
    },
    {
      title: 'Customer Management',
      icon: 'heroUsers',
      route: '/admin-dashboard/customers'
    },
    {
      title: 'Notifications',
      icon: 'heroBell',
      route: '/admin-dashboard/notifications',
      badge: 3 // Unread notifications
    },
    {
      title: 'Settings',
      icon: 'heroCog6Tooth',
      route: '/admin-dashboard/settings'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Set initial expanded state based on current route
    this.updateExpandedStates();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMenuItem(item: MenuItem) {
    if (item.children) {
      item.isExpanded = !item.isExpanded;
    }
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

  isParentActive(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => child.route && this.isRouteActive(child.route));
  }

  updateExpandedStates() {
    this.menuItems.forEach(item => {
      if (item.children && this.isParentActive(item)) {
        item.isExpanded = true;
      }
    });
  }

  logout() {
    // Implement logout logic
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}