import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule,  ActivatedRoute } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { NgIcon, provideIcons } from '@ng-icons/core';
import  { CartService } from "../../services/cart.service"
import { CardComponent, CardContentComponent } from "../../components/card/card.component"
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { ionGridOutline,ionFilter,ionList ,ionStar,ionHeart} from '@ng-icons/ionicons';

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  badge?: string
  category: string
  brand: string
  movement: string
  material: string
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterModule, FormsModule, CardComponent, CardContentComponent, NgIcon],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  viewProviders: [provideIcons({ heroMagnifyingGlass, ionGridOutline,ionFilter,ionList,ionStar ,ionHeart})]
})
export class ProductsComponent implements OnInit {

  SearchIcon = heroMagnifyingGlass
  FilterIcon = ionFilter
  GridIcon = ionGridOutline
  ListIcon = ionList
  StarIcon = ionStar
  HeartIcon = ionHeart

  products: Product[] = [
    {
      id: 1,
      name: "Chronos Elite",
      price: 899,
      originalPrice: 1299,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
      category: "Luxury",
      brand: "Chronos",
      movement: "Automatic",
      material: "Stainless Steel",
    },
    {
      id: 2,
      name: "Minimal Classic",
      price: 299,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.6,
      reviews: 89,
      badge: "New",
      category: "Minimalist",
      brand: "Chronos",
      movement: "Quartz",
      material: "Leather",
    },
    {
      id: 3,
      name: "Sport Pro",
      price: 599,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.9,
      reviews: 156,
      badge: "Popular",
      category: "Sport",
      brand: "Chronos",
      movement: "Automatic",
      material: "Titanium",
    },
    {
      id: 4,
      name: "Heritage Gold",
      price: 1299,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.7,
      reviews: 67,
      badge: "Limited",
      category: "Luxury",
      brand: "Chronos",
      movement: "Manual",
      material: "Gold",
    },
    {
      id: 5,
      name: "Urban Explorer",
      price: 449,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.5,
      reviews: 92,
      category: "Sport",
      brand: "Chronos",
      movement: "Quartz",
      material: "Stainless Steel",
    },
    {
      id: 6,
      name: "Classic Dress",
      price: 799,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.8,
      reviews: 78,
      category: "Luxury",
      brand: "Chronos",
      movement: "Automatic",
      material: "Leather",
    },
  ]

  filteredProducts: Product[] = []
  viewMode = "grid"
  sortBy = "featured"
  priceRange = [0, 2000]
  searchQuery = ""
  showMobileFilters = false

  categories = ["Luxury", "Sport", "Minimalist", "Dress"]
  materials = ["Stainless Steel", "Leather", "Titanium", "Gold"]

  selectedCategories: { [key: string]: boolean } = {}
  selectedMaterials: { [key: string]: boolean } = {}

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.filteredProducts = [...this.products]

    // Check for category filter from route params
    this.route.queryParams.subscribe((params) => {
      if (params["category"]) {
        const category = this.capitalizeFirst(params["category"])
        if (this.categories.includes(category)) {
          this.selectedCategories[category] = true
          this.filterProducts()
        }
      }
    })
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      const matchesCategory =
        Object.keys(this.selectedCategories).length === 0 ||
        Object.keys(this.selectedCategories).some((cat) => this.selectedCategories[cat] && product.category === cat)
      const matchesMaterial =
        Object.keys(this.selectedMaterials).length === 0 ||
        Object.keys(this.selectedMaterials).some((mat) => this.selectedMaterials[mat] && product.material === mat)
      const matchesPrice = product.price >= this.priceRange[0] && product.price <= this.priceRange[1]

      return matchesSearch && matchesCategory && matchesMaterial && matchesPrice
    })

    this.sortProducts()
  }

  sortProducts() {
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.id - a.id
        default:
          return 0
      }
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

  clearFilters() {
    this.selectedCategories = {}
    this.selectedMaterials = {}
    this.priceRange = [0, 2000]
    this.searchQuery = ""
    this.filterProducts()
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
