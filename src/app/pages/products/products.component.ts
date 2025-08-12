import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"

import { CardComponent, CardContentComponent } from "../../components/card/card.component"
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroEye, heroShoppingBag, heroXMark, heroChevronLeft, heroChevronRight, heroDocumentText } from '@ng-icons/heroicons/outline';
import { ionGridOutline, ionFilter, ionList, ionStar, ionHeart } from "@ng-icons/ionicons"
import { ApiCallService } from "../../services/api-call.service"
import { LoaderService } from "../../services/loader.service"

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;           // <-- Add this
  mainImageUrl: string;
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
  brand: string;
  movement: string;
  material: string;
  features?: string[];         // <-- Add this
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterModule, FormsModule, CardComponent, CardContentComponent, NgIcon],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  viewProviders: [provideIcons({
    heroMagnifyingGlass,
    ionGridOutline,
    ionFilter,
    ionList,
    ionStar,
    ionHeart,
    heroEye,
    heroShoppingBag,
    heroXMark,
    heroChevronLeft,   // <-- add
    heroChevronRight,
    heroDocumentText
  })]
})
export class ProductsComponent implements OnInit {

  Math = Math
  constructor(private apicall: ApiCallService,
    private loader: LoaderService,
    private route: ActivatedRoute
  ) { }

  searchQuery = ''
  sortBy = 'featured'
  viewMode: 'grid' | 'list' = 'grid'
  showMobileFilters = false
  priceRange = [0, 1000000]
  totalRecords = 0;
  pageNumber = 1;
  pageSize = 16;

  categories = []
  brands = []

  selectedCategories: { [key: string]: boolean } = {}
  selectedBrands: { [key: string]: boolean } = {}

  allProducts: Product[] = [
  ]

  filteredProducts: Product[] = []

  ngOnInit() {
    this.filteredProducts = [...this.allProducts]
    this.loadcategories();
    this.loadBrands();
    this.initializeFilters();
    this.route.queryParams.subscribe(params => {
      if (params['brand']) {
        this.selectedBrands = { [params['brand']]: true };
      }
      if (params['category']) {
        this.selectedCategories = { [params['category']]: true };
      }
      this.fetchProducts();
    });
    
  }

  initializeFilters() {
    this.categories.forEach(category => {
      this.selectedCategories[category] = false
    })
    this.brands.forEach(brand => {
      this.selectedBrands[brand] = false
    })
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0)
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0)
  }

  toggleFilters() {
    this.showMobileFilters = !this.showMobileFilters
  }
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  changePage(newPage: number) {
    if (newPage < 1 || (newPage - 1) * this.pageSize >= this.totalRecords) return;
    this.pageNumber = newPage;
    this.fetchProducts();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = +newSize;
    this.pageNumber = 1;
    this.fetchProducts();
  }


  sortProducts() {
    switch (this.sortBy) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        this.filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        this.filteredProducts.sort((a, b) => b.id - a.id)
        break
      default:
        // Featured - keep original order
        break
    }
  }

  filterProducts() {
    this.pageNumber = 1; // Reset to first page on filter
    this.fetchProducts();
  }

  clearFilters() {
    this.searchQuery = '';
    this.priceRange = [0, 1000000];
    this.initializeFilters();
    this.pageNumber = 1;
    this.fetchProducts();
  }
  loadcategories() {
    this.loader.show()
    this.apicall.GetcallWithoutToken('Category/GetCategorys').subscribe((response: any) => {
      if (response.responseCode === 200) {
        this.categories = response.data.map((item: any) => item.name);

        this.loader.hide();
      }
      else {

        this.loader.hide();
        console.error('Failed to load categories:', response.message);
      }
    }, (error: any) => {
      console.error('Error loading categories:', error);
      this.loader.hide();
    });
  }
  loadBrands() {
    this.loader.show();
    this.apicall.GetcallWithoutToken('Brand/GetBrands').subscribe((response: any) => {
      if (response.responseCode === 200) {
        this.brands = response.data.map((item: any) => item.name);

        this.loader.hide();
      } else {
        this.loader.hide();
        console.error('Failed to load brands:', response.message);
      }
    }, (error: any) => {
      console.error('Error loading brands:', error);
      this.loader.hide();
    });
  }

  // Add method to handle card click
  navigateToProduct(productId: number, event: Event) {
    // Navigate to product detail page
    // This will be handled by routerLink in template
  }
  fetchProducts() {
    this.loader.show();
    const selectedCats = Object.keys(this.selectedCategories).filter(cat => this.selectedCategories[cat]);
    const selectedBrands = Object.keys(this.selectedBrands).filter(brand => this.selectedBrands[brand]);
    const payload = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchTerm: this.searchQuery,
      categories: selectedCats,
      brands: selectedBrands,
      minPrice: this.priceRange[0],
      maxPrice: this.priceRange[1]
    };
    this.apicall.PostcallWithoutToken('Watch/GetWatches', payload).subscribe({
      next: (response) => {
        this.filteredProducts = response.data || [];
        this.totalRecords = response.totalRecords || 0;
        this.loader.hide();
      },
      error: () => {
        this.filteredProducts = [];
        this.totalRecords = 0;
        this.loader.hide();
      }
    });
  }
}
