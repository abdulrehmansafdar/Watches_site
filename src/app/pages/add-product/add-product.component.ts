import { Component, OnInit,PLATFORM_ID,Inject } from '@angular/core';
import { CommonModule,isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  heroPlus,
  heroXMark,
  heroPhoto,
  heroCloudArrowUp,
  heroEye,
  heroTrash,
  heroCheck,
  heroExclamationTriangle,
  heroInformationCircle,
  heroSparkles,
  heroStar,
  heroCurrencyDollar,
  heroTag,
  heroWrench,
  heroGlobeAlt,
  heroCalendar,
  heroTruck,
  heroShieldCheck,
  heroDocumentText,
  heroChevronDown,
  heroMagnifyingGlass,
  heroArrowRight
} from '@ng-icons/heroicons/outline';

interface ProductImage {
  id: string;
  file: File | null;
  url: string;
  preview: string;
  isMain: boolean;
  uploading: boolean;
  uploaded: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  category: string;
  brand: string;
  movement: string;
  material: string;
  caseDiameter: string;
  waterResistance: string;
  features: string[];
  specifications: any;
  badge: string;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  warranty: number;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgIcon],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  viewProviders: [provideIcons({ 
    heroPlus,
    heroXMark,
    heroPhoto,
    heroCloudArrowUp,
    heroEye,
    heroTrash,
    heroCheck,
    heroExclamationTriangle,
    heroInformationCircle,
    heroSparkles,
    heroStar,
    heroCurrencyDollar,
    heroTag,
    heroWrench,
    heroGlobeAlt,
    heroCalendar,
    heroTruck,
    heroShieldCheck,
    heroDocumentText,
    heroChevronDown,
    heroMagnifyingGlass,
    heroArrowRight
  })]
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  currentStep = 1;
  totalSteps = 4;
  isLoading = false;
  isSaving = false;
  showPreview = false;

  // Image handling
  productImages: ProductImage[] = [];
  maxImages = 10;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
   activePreviewTab = 0;
  previewViews = [
    { name: 'Grid View', description: 'How it appears in product listings' },
    { name: 'Detail View', description: 'Product detail page layout' },
    { name: 'List View', description: 'List view in product listings' }
  ];

  // Form options
  categories = ['Luxury', 'Sport', 'Minimalist', 'Classic', 'Digital', 'Smartwatch'];
  brands = ['Chronos', 'Omega', 'Rolex', 'Seiko', 'Casio', 'TAG Heuer', 'Breitling'];
  movements = ['Automatic', 'Quartz', 'Manual', 'Solar', 'Kinetic'];
  materials = ['Stainless Steel', 'Gold', 'Rose Gold', 'Titanium', 'Ceramic', 'Leather', 'Rubber'];
  waterResistanceOptions = ['30m', '50m', '100m', '200m', '300m', '500m', '1000m'];
  badges = ['Best Seller', 'New', 'Limited Edition', 'Popular', 'Trending', 'Premium', 'Hot Deal'];

  // Predefined features
  availableFeatures = [
    'Chronograph',
    'Date Display',
    'GMT Function',
    'Moon Phase',
    'Perpetual Calendar',
    'Tourbillon',
    'Power Reserve Indicator',
    'Dual Time Zone',
    'Alarm',
    'Luminous Hands',
    'Sapphire Crystal',
    'Anti-Magnetic',
    'Shock Resistant',
    'Screw-down Crown'
  ];

  // Enhanced dropdown state management
  dropdownStates: { [key: string]: boolean } = {
    category: false,
    brand: false,
    movement: false,
    material: false,
    waterResistance: false,
    badge: false
  };

  // Search queries for filtering
  searchQueries: { [key: string]: string } = {
    category: '',
    brand: '',
    movement: '',
    material: '',
    waterResistance: '',
    badge: ''
  };

  // Filtered options
  filteredOptions: { [key: string]: string[] } = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeForm();
    this.initializeFilteredOptions();
  }

  ngOnInit() {
    this.loadDraftIfExists();
    // Close dropdowns when clicking outside
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', this.onDocumentClick.bind(this));
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('click', this.onDocumentClick.bind(this));
    }
  }

  initializeForm() {
    this.productForm = this.fb.group({
      // Basic Info
      name: ['', [Validators.required, Validators.minLength(3)]],
      shortDescription: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      
      // Pricing
      price: [0, [Validators.required, Validators.min(1)]],
      originalPrice: [0],
      
      // Classification
      category: ['', Validators.required],
      brand: ['', Validators.required],
      badge: [''],
      tags: this.fb.array([]),
      
      // Technical Specs
      movement: ['', Validators.required],
      material: ['', Validators.required],
      caseDiameter: ['', Validators.required],
      waterResistance: ['', Validators.required],
      features: this.fb.array([]),
      
      // Specifications
      specifications: this.fb.group({
        caseMaterial: [''],
        dialColor: [''],
        strapMaterial: [''],
        crystal: [''],
        powerReserve: [''],
        jewels: [''],
        frequency: ['']
      }),
      
      // Inventory
      inStock: [true],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      sku: ['', Validators.required],
      weight: [0, Validators.min(0)],
      dimensions: this.fb.group({
        length: [0, Validators.min(0)],
        width: [0, Validators.min(0)],
        height: [0, Validators.min(0)]
      }),
      warranty: [24, [Validators.required, Validators.min(1)]],
      
      // SEO
      seoTitle: [''],
      seoDescription: ['']
    });

    // Auto-generate SKU based on name changes
    this.productForm.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.productForm.get('sku')?.value) {
        const sku = this.generateSKU(name);
        this.productForm.patchValue({ sku });
      }
    });
  }

  // Initialize filtered options
  initializeFilteredOptions() {
    this.filteredOptions = {
      category: [...this.categories],
      brand: [...this.brands],
      movement: [...this.movements],
      material: [...this.materials],
      waterResistance: [...this.waterResistanceOptions],
      badge: [...this.badges]
    };
  }

  // Step Navigation
  nextStep() {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step <= this.currentStep || this.validateStepsUpTo(step - 1)) {
      this.currentStep = step;
    }
  }

  validateCurrentStep(): boolean {
    // console.log(`Validating step ${this.currentStep}`);
    switch (this.currentStep) {
      case 1:
        return this.validateBasicInfo();
      case 2:
        return this.validateTechnicalSpecs();
      case 3:
        return this.validateInventoryInfo();
      case 4:
        return this.validateImages();
      default:
        return true;
    }
  }

  validateStepsUpTo(step: number): boolean {
    for (let i = 1; i <= step; i++) {
      const currentStepBackup = this.currentStep;
      this.currentStep = i;
      if (!this.validateCurrentStep()) {
        this.currentStep = currentStepBackup;
        return false;
      }
      this.currentStep = currentStepBackup;
    }
    return true;
  }

  validateBasicInfo(): boolean {
    const controls = ['name', 'shortDescription', 'description', 'price', 'category', 'brand'];
    return controls.every(control => this.productForm.get(control)?.valid);
  }

  validateTechnicalSpecs(): boolean {
    const controls = ['movement', 'material', 'caseDiameter', 'waterResistance'];
    return controls.every(control => this.productForm.get(control)?.valid);
  }

  validateInventoryInfo(): boolean {
    const controls = ['stockQuantity', 'sku', 'warranty'];
    return controls.every(control => this.productForm.get(control)?.valid);
  }

  validateImages(): boolean {
    return this.productImages.length > 0 && this.productImages.some(img => img.isMain);
  }

  // Image Handling
  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        if (this.productImages.length < this.maxImages) {
          this.addImage(file);
        }
      });
    }
    input.value = ''; // Reset input
  }

  onImageDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (this.productImages.length < this.maxImages && this.allowedImageTypes.includes(file.type)) {
          this.addImage(file);
        }
      });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  addImage(file: File) {
    if (file.size > this.maxFileSize) {
      alert('File size too large. Maximum 5MB allowed.');
      return;
    }

    if (!this.allowedImageTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    const reader = new FileReader();
    const imageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const productImage: ProductImage = {
      id: imageId,
      file: file,
      url: '',
      preview: '',
      isMain: this.productImages.length === 0, // First image is main by default
      uploading: false,
      uploaded: false
    };

    reader.onload = () => {
      productImage.preview = reader.result as string;
      this.productImages.push(productImage);
    };

    reader.readAsDataURL(file);
  }

  removeImage(imageId: string) {
    const index = this.productImages.findIndex(img => img.id === imageId);
    if (index > -1) {
      const wasMain = this.productImages[index].isMain;
      this.productImages.splice(index, 1);
      
      // If removed image was main, make first image main
      if (wasMain && this.productImages.length > 0) {
        this.productImages[0].isMain = true;
      }
    }
  }

  setMainImage(imageId: string) {
    this.productImages.forEach(img => {
      img.isMain = img.id === imageId;
    });
  }

  // Features Management
  get featuresArray() {
    return this.productForm.get('features') as FormArray;
  }

  addFeature(feature: string) {
    if (!this.featuresArray.value.includes(feature)) {
      this.featuresArray.push(this.fb.control(feature));
    }
  }

  removeFeature(index: number) {
    this.featuresArray.removeAt(index);
  }

  // Tags Management
  get tagsArray() {
    return this.productForm.get('tags') as FormArray;
  }

  addTag(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const tag = input.value.trim();
    
    if (event.key === 'Enter' && tag && !this.tagsArray.value.includes(tag)) {
      this.tagsArray.push(this.fb.control(tag));
      input.value = '';
      event.preventDefault();
    }
  }

  removeTag(index: number) {
    this.tagsArray.removeAt(index);
  }

  // Utility Functions
  generateSKU(name: string): string {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `CHR-${cleanName.slice(0, 6)}-${timestamp}`;
  }

  calculateSavings(): number {
    const price = this.productForm.get('price')?.value || 0;
    const originalPrice = this.productForm.get('originalPrice')?.value || 0;
    return originalPrice > price ? originalPrice - price : 0;
  }

  getDiscountPercentage(): number {
    const price = this.productForm.get('price')?.value || 0;
    const originalPrice = this.productForm.get('originalPrice')?.value || 0;
    return originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  }

  // Form Actions
  saveDraft() {
    if(isPlatformBrowser(this.platformId)) {
      const formData = this.productForm.value;
    localStorage.setItem('productDraft', JSON.stringify(formData));
    alert('Draft saved successfully!');
    }
  }

  loadDraftIfExists() {
    if (isPlatformBrowser(this.platformId)) {
      const draft = localStorage.getItem('productDraft');
    if (draft) {
      const formData = JSON.parse(draft);
      this.productForm.patchValue(formData);
    }
    }
  }

  clearDraft() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('productDraft');
    }
  }

  

  async saveProduct() {
    if (!this.productForm.valid || this.productImages.length === 0) {
      alert('Please fill all required fields and add at least one image.');
      return;
    }

    this.isSaving = true;

    try {
      // Simulate image upload
      for (const image of this.productImages) {
        image.uploading = true;
        await this.simulateImageUpload(image);
        image.uploading = false;
        image.uploaded = true;
      }

      // Simulate product creation
      await this.simulateProductCreation();

      this.clearDraft();
      alert('Product created successfully!');
      this.router.navigate(['/admin/products']);
    } catch (error) {
      alert('Error creating product. Please try again.');
    } finally {
      this.isSaving = false;
    }
  }

  private simulateImageUpload(image: ProductImage): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        image.url = '/assets/products/' + image.file?.name;
        resolve();
      }, Math.random() * 2000 + 1000);
    });
  }

  private simulateProductCreation(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
  }

  // Step Information
  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Basic Information';
      case 2: return 'Technical Specifications';
      case 3: return 'Inventory & Details';
      case 4: return 'Images & Media';
      default: return '';
    }
  }

  getStepIcon(step: number): string {
    switch (step) {
      case 1: return 'heroInformationCircle';
      case 2: return 'heroWrench';
      case 3: return 'heroTruck';
      case 4: return 'heroPhoto';
      default: return 'heroCheck';
    }
  }

  isStepComplete(step: number): boolean {
    if (step < this.currentStep) return true;
    if (step === this.currentStep) return false;
    return false;
  }

  isStepAccessible(step: number): boolean {
    return step <= this.currentStep;
  }

  // Toggle dropdown visibility
  toggleDropdown(dropdownName: string) {
    // Close all other dropdowns
    Object.keys(this.dropdownStates).forEach(key => {
      if (key !== dropdownName) {
        this.dropdownStates[key] = false;
      }
    });
    
    // Toggle the selected dropdown
    this.dropdownStates[dropdownName] = !this.dropdownStates[dropdownName];
    
    // Reset search when opening
    if (this.dropdownStates[dropdownName]) {
      this.searchQueries[dropdownName] = '';
      this.filterOptions(dropdownName);
    }
  }

  // Close dropdown when clicking outside
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      Object.keys(this.dropdownStates).forEach(key => {
        this.dropdownStates[key] = false;
      });
    }
  }

  // Filter options based on search query
  filterOptions(dropdownName: string) {
    debugger
  const query = this.searchQueries[dropdownName]?.toLowerCase() || '';
  const allOptions = this.getAllOptions(dropdownName);
  
  this.filteredOptions[dropdownName] = allOptions.filter(option =>
    option.toLowerCase().includes(query)
  );
}

  // Get all options for a dropdown
  getAllOptions(dropdownName: string): string[] {
    switch (dropdownName) {
      case 'category': return this.categories;
      case 'brand': return this.brands;
      case 'movement': return this.movements;
      case 'material': return this.materials;
      case 'waterResistance': return this.waterResistanceOptions;
      case 'badge': return this.badges;
      default: return [];
    }
  }

  // Get filtered options for display
  getFilteredOptions(dropdownName: string): string[] {
    return this.filteredOptions[dropdownName] || [];
  }

  // Select an option from dropdown
  selectOption(dropdownName: string, value: string) {
    this.productForm.patchValue({ [dropdownName]: value });
    this.dropdownStates[dropdownName] = false;
    this.searchQueries[dropdownName] = '';
  }

  // Get material color for visual representation
  getMaterialColor(material: string): string {
    const colors: { [key: string]: string } = {
      'Stainless Steel': 'bg-gray-400',
      'Gold': 'bg-yellow-400',
      'Rose Gold': 'bg-pink-400',
      'Titanium': 'bg-gray-500',
      'Ceramic': 'bg-white border border-gray-300',
      'Leather': 'bg-amber-600',
      'Rubber': 'bg-gray-800'
    };
    return colors[material] || 'bg-gray-300';
  }

  // Get water resistance description
  getWaterResistanceDescription(resistance: string): string {
    const descriptions: { [key: string]: string } = {
      '30m': 'Basic splash protection',
      '50m': 'Light swimming',
      '100m': 'Swimming and snorkeling',
      '200m': 'Professional marine activity',
      '300m': 'Saturation diving',
      '500m': 'Professional diving',
      '1000m': 'Deep sea diving'
    };
    return descriptions[resistance] || 'Water resistant';
  }

  onFeatureChange(event: Event, feature: string) {
  const input = event.target as HTMLInputElement;
  if (input && input.checked) {
    this.addFeature(feature);
  } else {
    this.removeFeature(this.featuresArray.value.indexOf(feature));
  }
}
  getMainImage(): ProductImage | null {
    return this.productImages.find(img => img.isMain) || this.productImages[0] || null;
  }

  getEmptyImageSlots(): any[] {
    const emptySlots = Math.max(0, 4 - this.productImages.length);
    return new Array(emptySlots).fill(null);
  }

  togglePreview() {
    this.showPreview = !this.showPreview;
    
    // Reset to first tab when opening preview
    if (this.showPreview) {
      this.activePreviewTab = 0;
    }
  }

  // Enhanced validation for preview
  isPreviewReady(): boolean {
    return !!(
      this.productForm.get('name')?.value &&
      this.productForm.get('price')?.value &&
      this.productForm.get('category')?.value &&
      this.productImages.length > 0
    );
  }

  // Get preview status
  getPreviewStatus(): string {
    if (!this.productForm.get('name')?.value) return 'Product name is required for preview';
    if (!this.productForm.get('price')?.value) return 'Price is required for preview';
    if (!this.productForm.get('category')?.value) return 'Category is required for preview';
    if (this.productImages.length === 0) return 'At least one image is required for preview';
    return 'Preview ready';
  }
}