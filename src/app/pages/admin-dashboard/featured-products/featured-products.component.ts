import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlass,
  heroStar,
  heroChevronLeft,
  heroChevronRight,
  heroEye
} from '@ng-icons/heroicons/outline';
import { ApiCallService } from '../../../services/api-call.service';
import { LoaderService } from '../../../services/loader.service';
import { ThemeService } from '../../../services/theme.service';
import { FilterPipe } from '../../../pipes/filter.pipe';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  mainImageUrl: string;
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
  brand: string;
  inStock: boolean;
  isFeatured: boolean;
  quantity: number;
}

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgIcon,FilterPipe],
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss'],
  viewProviders: [provideIcons({
    heroMagnifyingGlass,
    heroStar,
    heroChevronLeft,
    heroChevronRight,
    heroEye
  })]
})
export class FeaturedProductsComponent implements OnInit {
  Math = Math;
  
  // Search and filters
  searchQuery = '';
  
  // Pagination
  totalRecords = 0;
  pageNumber = 1;
  pageSize = 12;
  
  // Products
  products: Product[] = [];
  isLoading = false;

  constructor(
    private apiService: ApiCallService,
    private loaderService: LoaderService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading = true;
    this.loaderService.show();

    const payload = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchTerm: this.searchQuery,
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 1000000
    };

    this.apiService.PostcallWithToken('Watch/GetWatches', payload).subscribe({
      next: (response: any) => {
        
          this.products = response.data || [];
          this.totalRecords = response.totalRecords || 0;
        
          
        
        this.isLoading = false;
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.themeService.shownotification('Error loading products: ' + error.message, 'error');
        this.products = [];
        this.totalRecords = 0;
        this.isLoading = false;
        this.loaderService.hide();
      }
    });
  }

  searchProducts() {
    this.pageNumber = 1; // Reset to first page on search
    this.fetchProducts();
  }

  toggleFeatured(product: Product) {
    const newFeaturedStatus = !product.isFeatured;
    const actionText = newFeaturedStatus ? 'feature' : 'unfeature';
    
    
        this.loaderService.show();
        
        this.apiService.PostcallWithToken(
          `Watch/MarkWatchAsFeatured?watchId=${product.id}&isFeatured=${newFeaturedStatus}`,
          null
        ).subscribe({
          next: (response: any) => {
            this.loaderService.hide();
            if (response.responseCode === 200) {
              product.isFeatured = newFeaturedStatus;
              this.themeService.shownotification(
                `"${product.name}" has been ${newFeaturedStatus ? 'marked as featured' : 'removed from featured'}.`,
                'success'
              );
            } else {
              this.themeService.shownotification(
                `Failed to ${actionText} product: ` + response.errorMessage,
                'error'
              );
            }
          },
          error: (error: any) => {
            this.loaderService.hide();
            this.themeService.shownotification(
              `Error ${actionText}ing product: ` + error.message,
              'error'
            );
          }
        });
      
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.pageNumber) {
      this.pageNumber = page;
      this.fetchProducts();
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.goToPage(this.pageNumber - 1);
    }
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.goToPage(this.pageNumber + 1);
    }
  }

  getVisiblePages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.pageNumber;
    const visiblePages: number[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Show current page and surrounding pages
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      if (start > 1) {
        visiblePages.push(1);
        if (start > 2) {
          visiblePages.push(-1); // Represents ellipsis
        }
      }

      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          visiblePages.push(-1); // Represents ellipsis
        }
        visiblePages.push(totalPages);
      }
    }

    return visiblePages;
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  trackByFn(index: number, product: Product): number {
    return product.id;
  }
}