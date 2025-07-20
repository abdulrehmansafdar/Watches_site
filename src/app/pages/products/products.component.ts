import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"

import { CardComponent, CardContentComponent } from "../../components/card/card.component"
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroEye, heroShoppingBag, heroXMark } from '@ng-icons/heroicons/outline';
import { ionGridOutline, ionFilter, ionList, ionStar, ionHeart } from "@ng-icons/ionicons"

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
  viewProviders: [provideIcons({ 
    heroMagnifyingGlass, 
    ionGridOutline,
    ionFilter,
    ionList,
    ionStar,
    ionHeart,
    heroEye,
    heroShoppingBag,
    heroXMark
  })]
})
export class ProductsComponent implements OnInit {

  Math = Math
  
  searchQuery = ''
  sortBy = 'featured'
  viewMode: 'grid' | 'list' = 'grid'
  showMobileFilters = false
  priceRange = [0, 2000]

  categories = ['Luxury', 'Sport', 'Minimalist', 'Classic', 'Digital']
  materials = ['Stainless Steel', 'Gold', 'Titanium', 'Ceramic', 'Leather']
  
  selectedCategories: { [key: string]: boolean } = {}
  selectedMaterials: { [key: string]: boolean } = {}

  allProducts: Product[] = [
    {
      id: 1,
      name: "Chronos Elite",
      price: 899,
      originalPrice: 1299,
      image: "/assets/d-1.webp",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
      category: "Luxury",
      brand: "Chronos",
      movement: "Automatic",
      material: "Stainless Steel"
    },
    {
      id: 2,
      name: "Minimal Classic",
      price: 299,
      image: "/assets/d-2.webp",
      rating: 4.6,
      reviews: 89,
      badge: "New",
      category: "Minimalist",
      brand: "Chronos",
      movement: "Quartz",
      material: "Stainless Steel"
    },
    {
      id: 3,
      name: "Sport Pro",
      price: 599,
      image: "/assets/d-3.webp",
      rating: 4.9,
      reviews: 156,
      badge: "Popular",
      category: "Sport",
      brand: "Chronos",
      movement: "Automatic",
      material: "Titanium"
    },
    {
      id: 4,
      name: "Heritage Gold",
      price: 1299,
      image: "/assets/d-4.webp",
      rating: 4.7,
      reviews: 67,
      badge: "Limited",
      category: "Luxury",
      brand: "Chronos",
      movement: "Manual",
      material: "Gold"
    },
   
  ]

  filteredProducts: Product[] = []

  ngOnInit() {
    this.filteredProducts = [...this.allProducts]
    this.initializeFilters()
  }

  initializeFilters() {
    this.categories.forEach(category => {
      this.selectedCategories[category] = false
    })
    this.materials.forEach(material => {
      this.selectedMaterials[material] = false
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

  filterProducts() {
    this.filteredProducts = this.allProducts.filter(product => {
      // Search filter
      const matchesSearch = !this.searchQuery || 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(this.searchQuery.toLowerCase())

      // Price filter
      const matchesPrice = product.price >= this.priceRange[0] && product.price <= this.priceRange[1]

      // Category filter
      const selectedCats = Object.keys(this.selectedCategories).filter(cat => this.selectedCategories[cat])
      const matchesCategory = selectedCats.length === 0 || selectedCats.includes(product.category)

      // Material filter
      const selectedMats = Object.keys(this.selectedMaterials).filter(mat => this.selectedMaterials[mat])
      const matchesMaterial = selectedMats.length === 0 || selectedMats.includes(product.material)

      return matchesSearch && matchesPrice && matchesCategory && matchesMaterial
    })

    this.sortProducts()
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

  clearFilters() {
    this.searchQuery = ''
    this.priceRange = [0, 2000]
    this.initializeFilters()
    this.filterProducts()
  }
}
