import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheck, heroChevronDown, heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'custom-dropdown',
  standalone: true,
  imports: [CommonModule, NgIcon, FormsModule],
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss'],
  viewProviders: [provideIcons({
    heroMagnifyingGlass,
    heroCheck,
    heroChevronDown
  })]
})
export class CustomDropdownComponent implements OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() options: string[] = [];
  @Input() selected: string = '';
  @Input() icon: string = '';
  @Input() searchEnabled: boolean = true;
  @Input() showIcon: boolean = true;
  @Input() noResultsText: string = 'No results found';
  @Input() required: boolean = false;
  @Input() dropdownName: string = ''; // e.g. 'Brand', 'Category', 'movement', etc.
  @Input() getOptionColor?: (option: string) => string;
  @Input() getOptionDescription?: (option: string) => string;

  @Output() select = new EventEmitter<string>();

  dropdownOpen = false;
  searchQuery = '';
  isLoading = false;

  get filteredOptions() {
    return this.options.filter(opt =>
      opt.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  constructor(private productService: ProductService, private elRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (this.dropdownOpen && !this.elRef.nativeElement.contains(target)) {
      this.dropdownOpen = false;
      this.searchQuery = '';

    }
  }
  private boundDocumentClick!: (event: Event) => void;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.boundDocumentClick = this.onDocumentClick.bind(this);
      document.addEventListener('click', this.boundDocumentClick);
    }
    if (this.dropdownName) {
      this.isLoading = true;
      this.productService.getDropdownData(this.dropdownName, `Get${this.dropdownName}s`).subscribe({
        next: (response) => {
          if (response.responseCode === 200) {
            this.options = response.data.map((item: any) => item.name);
          }
          this.isLoading = false;
        },
        error: () => {
          this.options = [];
          this.isLoading = false;
        }
      });
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.searchQuery = '';
  }

  selectOption(option: string) {
    this.select.emit(option);
    this.dropdownOpen = false;
    this.searchQuery = '';
  }
  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('click', this.boundDocumentClick);
    }
  }
}