import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../services/cart.service';
import {
  CardComponent,
  CardContentComponent,
} from '../../components/card/card.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowRight,
  heroStar,
  heroHeart,
  heroEye,
  heroChevronLeft,
  heroChevronRight,
  heroShieldCheck,
  heroSparkles,
  heroCurrencyDollar,
  heroTruck,
  heroGift,
  heroPhone,
} from '@ng-icons/heroicons/outline';
import { ionBag, ionStar } from '@ng-icons/ionicons';
import { ApiCallService } from '../../services/api-call.service';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
}

interface Collection {
  name: string;
  image: string;
  description: string;
  link: string;
}
interface WatchBrand {
  id: number;
  name: string;
  logo: string;
  description?: string;
}
interface ScrollingOffer {
  text: string;
  icon: string;
  iconColor: string;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardComponent,
    CardContentComponent,
    NgIcon,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  viewProviders: [
    provideIcons({
      heroArrowRight,
      heroStar,
      heroHeart,
      heroEye,
      ionBag,
      ionStar,
      heroChevronLeft,
      heroChevronRight,
      heroShieldCheck,
      heroSparkles,
      heroCurrencyDollar,
      heroTruck,
      heroGift,
      heroPhone,
    }),
  ],
})
export class HomeComponent implements OnInit {
  email = '';
  Math = Math;
  categoryWatches: any[] = [];
  ngOnInit() {
    this.apicall.GetcallWithoutToken('Watch/GetWatchesByCategory').subscribe({
      next: (res) => (this.categoryWatches = res),
      error: () => (this.categoryWatches = []),
    });
  }
  scrollingOffers: ScrollingOffer[] = [
    {
      text: 'Free Worldwide Shipping on Orders Over $500',
      icon: 'heroTruck',
      iconColor: 'text-blue-400',
    },
    {
      text: '2-Year International Warranty',
      icon: 'heroShieldCheck',
      iconColor: 'text-green-400',
    },
    {
      text: 'Premium Quality Guaranteed',
      icon: 'heroSparkles',
      iconColor: 'text-yellow-400',
    },
    {
      text: 'Best Price Promise',
      icon: 'heroCurrencyDollar',
      iconColor: 'text-emerald-400',
    },
    {
      text: 'Exclusive Member Discounts Up to 20%',
      icon: 'heroGift',
      iconColor: 'text-pink-400',
    },
    {
      text: '24/7 Customer Support',
      icon: 'heroPhone',
      iconColor: 'text-purple-400',
    },
    {
      text: '30-Day Money Back Guarantee',
      icon: 'heroShieldCheck',
      iconColor: 'text-green-400',
    },
    {
      text: 'Authentic Timepieces Only',
      icon: 'heroSparkles',
      iconColor: 'text-orange-400',
    },
  ];
  watchBrands: WatchBrand[] = [
    {
      id: 1,
      name: 'Rolex',
      logo: '/assets/brands/rolex-logo.png',
      description: 'A crown for every achievement',
    },
    {
      id: 2,
      name: 'Patek Philippe',
      logo: '/assets/brands/patek-philippe-logo.webp',
      description: 'You never actually own a Patek Philippe',
    },
    {
      id: 3,
      name: 'Tissot',
      logo: '/assets/brands/tissot-logo.webp',
      description: 'Innovators by tradition',
    },
    {
      id: 4,
      name: 'Tag Heuer',
      logo: '/assets/brands/tag-heuer-logo.webp',
      description: "Don't crack under pressure",
    },
    {
      id: 5,
      name: 'Audemars Piguet',
      logo: '/assets/brands/audemars-piguet-ap.webp',
      description: 'To break the rules, you must first master them',
    },
    {
      id: 6,
      name: 'Omega',
      logo: '/assets/brands/omega-logo.webp',
      description: 'The mark of excellence',
    },
  ];

  collections: Collection[] = [
    {
      name: 'Luxury Heritage',
      image: '/assets/luxury.webp',
      link: 'Luxury',

      description:
        'Timeless elegance meets traditional craftsmanship in our heritage collection.',
    },
    {
      name: 'Modern Sport',
      image: '/assets/sports.webp',
      link: 'Sport',
      description:
        'Built for performance, designed for style. Perfect for the active lifestyle.',
    },
    {
      name: 'Minimalist Chic',
      image: '/assets/mini.webp',
      link: 'Minimalist',
      description:
        'The pinnacle of horological excellence, featuring premium materials and complications.',
    },
  ];

  currentSlides: { [key: string]: number } = {};

  constructor(
    private cartService: CartService,
    private apicall: ApiCallService,
    private router: Router
  ) {
    // Initialize current slides for each category
    this.categoryWatches.forEach((category) => {
      this.currentSlides[category.id] = 0;
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }
  scrollCarousel(categoryId: string, direction: 'left' | 'right') {
    const el = document.getElementById(`carousel-${categoryId}`);
    if (el) {
      const scrollAmount = 300; // px per card
      el.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  // Carousel navigation methods
  nextSlide(categoryId: string) {
    const category = this.categoryWatches.find((c) => c.id === categoryId);
    if (category) {
      const maxSlide = Math.max(0, category.products.length - 4); // Show 4 cards at once
      this.currentSlides[categoryId] = Math.min(
        this.currentSlides[categoryId] + 1,
        maxSlide
      );
    }
  }
  goToBrand(brand: string) {
    this.router.navigate(['/products'], { queryParams: { brand } });
  }

  goToCategory(category: string) {
    this.router.navigate(['/products'], { queryParams: { category } });
  }

  prevSlide(categoryId: string) {
    this.currentSlides[categoryId] = Math.max(
      0,
      this.currentSlides[categoryId] - 1
    );
  }

  getVisibleProducts(category: any) {
    const start = this.currentSlides[category.id];
    return category.products.slice(start, start + 4);
  }

  addToCart(product: Product) {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
    });
  }
  // Split your offers into two arrays for multi-row effect
  primaryOffers: ScrollingOffer[] = [
    {
      text: 'Free Worldwide Shipping on Orders Over $500',
      icon: 'heroTruck',
      iconColor: 'text-blue-400',
    },
    {
      text: '2-Year International Warranty',
      icon: 'heroShieldCheck',
      iconColor: 'text-green-400',
    },
    {
      text: 'Premium Quality Guaranteed',
      icon: 'heroSparkles',
      iconColor: 'text-yellow-400',
    },
    {
      text: 'Best Price Promise',
      icon: 'heroCurrencyDollar',
      iconColor: 'text-emerald-400',
    },
  ];

  secondaryOffers: ScrollingOffer[] = [
    {
      text: 'Exclusive Member Discounts Up to 20%',
      icon: 'heroGift',
      iconColor: 'text-pink-400',
    },
    {
      text: '24/7 Customer Support',
      icon: 'heroPhone',
      iconColor: 'text-purple-400',
    },
    {
      text: '30-Day Money Back Guarantee',
      icon: 'heroShieldCheck',
      iconColor: 'text-green-400',
    },
    {
      text: 'Authentic Timepieces Only',
      icon: 'heroSparkles',
      iconColor: 'text-orange-400',
    },
  ];
}
