import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  heroCurrencyRupee,
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
import { ProductService } from '../../services/product.service';
import { CustomDropdownComponent } from '../../components/custom-dropdown/custom-dropdown.component';
import { ApiCallService } from '../../services/api-call.service';
import { ThemeService } from '../../services/theme.service';
import { LoaderService } from '../../services/loader.service';

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
  Category: string;
  Brand: string;
  movement: string;
  material: string;
  caseDiameter: string;
  Resistance: string;
  features: string[];
  specifications: any;
  Badge: string;
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgIcon, CustomDropdownComponent],
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
    heroCurrencyRupee,
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
  stepAttempted = false;

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
  Brands: any[] = [];
  categories: any[] = [];
  movements: any[] = [];
  materials: any[] = [];
  ResistanceOptions: any[] = [];
  Badges: any[] = [];

  // Predefined features
  availableFeatures = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private productService: ProductService,
    private apiService: ApiCallService,
    private themeService: ThemeService,
    private loader: LoaderService
  ) {
    this.initializeForm();

  }

  ngOnInit() {
    this.loadDraftIfExists();
    // Close dropdowns when clicking outside

    this.loadFeatures();
  }

  loadFeatures() {
    this.apiService.GetcallWithToken('Feature/GetFeatures').subscribe({
      next: (response) => {
        if (response.responseCode === 200) {
          this.availableFeatures = response.data.map((item: any) => item.name);
        }
        else {
          // this.themeService.shownotification('Failed to load features: ' + response.errorMessage, 'error');
          this.availableFeatures = [];
        }
      },
      error: (error) => {
        // this.themeService.shownotification('Error loading features: ' + error.message, 'error');
        console.error('Error loading features:', error);
        this.availableFeatures = [];
      }
    });
  }



  initializeForm() {
    this.productForm = this.fb.group({
      // Basic Info
      name: ['', [Validators.required, Validators.minLength(3)]],
      shortDescription: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],

      // Pricing
      price: [0, [Validators.required, Validators.min(1)]],
      originalPrice: [''],

      // Classification
      Category: ['', Validators.required],
      Brand: ['', Validators.required],
      Badge: [''],
      tags: this.fb.array([]),

      // Technical Specs
      movement: ['', Validators.required],
      material: ['', Validators.required],
      caseDiameter: ['', Validators.required],
      Resistance: [''],
      features: this.fb.array([]),

      // Specifications
      specifications: this.fb.group({
        caseMaterial: [''],
        dialColor: [''],
        strapMaterial: [''],
        strapColor: [''],

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



  // Step Navigation
  onNextStep() {
    debugger
    this.stepAttempted = true;
    if (this.validateCurrentStep()) {
      this.stepAttempted = false;
      this.nextStep();
    }
  }
  nextStep() {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        console.log(`Navigating to step ${this.currentStep}`);
      }
      else {
        // If on the last step, trigger save action
        this.saveProduct();
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
    const controls = ['name', 'shortDescription', 'description', 'price', 'Category', 'Brand'];
    return controls.every(control => this.productForm.get(control)?.valid);
  }

  validateTechnicalSpecs(): boolean {
    const controls = ['movement', 'material', 'caseDiameter', 'Resistance'];
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
    if (isPlatformBrowser(this.platformId)) {
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
    this.loader.show(); // Show loader while saving

    try {
      // Prepare the data
      const formValue = this.productForm.value;

      // Convert FormArray to array for tags and features
      formValue.tags = this.tagsArray.value;
      formValue.features = this.featuresArray.value;

      // Build the JSON string for the watch
      const watchJson = JSON.stringify(formValue);

      // Build FormData
      const formData = new FormData();
      formData.append('watchJson', watchJson);

      // Append images
      this.productImages.forEach((img, idx) => {
        if (img.file) {
          formData.append('images', img.file, img.file.name);
        }
      });

      // Call API (use your ApiCallService or HttpClient directly)
      this.apiService.PostFormDataWithToken('Watch/AddWatch', formData).subscribe({
        next: (response) => {

          if (response.responseCode === 200) {
            this.themeService.shownotification('Product created successfully!', 'success');
            this.clearDraft(); // Clear draft after successful save
            // move to first step
            this.currentStep = 1;
            this.productImages = []; // Clear images after save
            this.productForm.reset(); // Reset form
            this.loader.hide(); // Hide loader after save
            this.isSaving = false; // Reset saving state
          }
          else {
            this.themeService.shownotification('Failed to create product: ' + response.errorMessage, 'error');
            this.loader.hide(); // Hide loader on error
            this.isSaving = false; // Reset saving state
          }
          // this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          this.themeService.shownotification('Error creating product: ' + error.message, 'error');
          console.error('Error creating product:', error);
          this.loader.hide(); // Hide loader on error
          this.isSaving = false; // Reset saving state
        },

      });
    } catch (error) {
      console.error('Error saving product:', error);
      this.isSaving = false;
      this.loader.hide(); // Hide loader on error
    }
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


  // Close dropdown when clicking outside


  // Filter options based on search query

  // Get all options for a dropdown


  // Get filtered options for display


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
  getResistanceDescription(resistance: string): string {
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
      this.productForm.get('Category')?.value &&
      this.productImages.length > 0
    );
  }

  // Get preview status
  getPreviewStatus(): string {
    if (!this.productForm.get('name')?.value) return 'Product name is required for preview';
    if (!this.productForm.get('price')?.value) return 'Price is required for preview';
    if (!this.productForm.get('Category')?.value) return 'Category is required for preview';
    if (this.productImages.length === 0) return 'At least one image is required for preview';
    return 'Preview ready';
  }
}