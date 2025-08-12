import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroPlus,
  heroPencil,
  heroTrash,
  heroXMark,
  heroCheck
} from '@ng-icons/heroicons/outline';
import { ApiCallService } from '../../../services/api-call.service';
import { LoaderService } from '../../../services/loader.service';
import Swal from 'sweetalert2';
import { ThemeService } from '../../../services/theme.service';

interface ManagementItem {
  id: number;
  name: string;
}

interface TableConfig {
  title: string;
  endpoint: string;
  items: ManagementItem[];
  isLoading: boolean;
}

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgIcon],
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss'],
  viewProviders: [provideIcons({
    heroPlus,
    heroPencil,
    heroTrash,
    heroXMark,
    heroCheck
  })]
})
export class AdminManagementComponent implements OnInit {
  showModal = false;
  modalTitle = '';
  modalItemName = '';
  isEditMode = false;
  currentEditId: number | null = null;
  currentTableType = '';

  tables: { [key: string]: TableConfig } = {
    categories: {
      title: 'Categories',
      endpoint: 'Category',
      items: [],
      isLoading: false
    },
    brands: {
      title: 'Brands',
      endpoint: 'Brand',
      items: [],
      isLoading: false
    },
    badges: {
      title: 'Badges',
      endpoint: 'Badge',
      items: [],
      isLoading: false
    },
    movements: {
      title: 'Movements',
      endpoint: 'Movement',
      items: [],
      isLoading: false
    },
    features: {
      title: 'Features',
      endpoint: 'Feature',
      items: [],
      isLoading: false
    },
    materials: {
      title: 'Materials',
      endpoint: 'Material',
      items: [],
      isLoading: false
    },
    resistances: {
      title: 'Water Resistance',
      endpoint: 'Resistance',
      items: [],
      isLoading: false
    }
  };

  constructor(
    private apiService: ApiCallService,
    private loaderService: LoaderService,
    private theme:ThemeService
  ) { }

  ngOnInit() {
    this.loadAllTables();
  }

  loadAllTables() {
    Object.keys(this.tables).forEach(tableType => {
      this.loadTableData(tableType);
    });
  }

  loadTableData(tableType: string) {
    const table = this.tables[tableType];
    table.isLoading = true;

    const endpoint = `${table.endpoint}/Get${table.endpoint}s`;

    this.apiService.GetcallWithToken(endpoint).subscribe({
      next: (response: any) => {
        if (response.responseCode === 200) {
          table.items = response.data || [];
        } else {
          console.error(`Failed to load ${tableType}:`, response.message);
          table.items = [];
        }
        table.isLoading = false;
      },
      error: (error: any) => {
        console.error(`Error loading ${tableType}:`, error);
        table.items = [];
        table.isLoading = false;
      }
    });
  }

  openAddModal(tableType: string) {
    this.currentTableType = tableType;
    this.modalTitle = `Add ${this.tables[tableType].title.slice(0, -1)}`;
    this.modalItemName = '';
    this.isEditMode = false;
    this.currentEditId = null;
    this.showModal = true;
  }

  trackByFn(index: number, item: ManagementItem): number {
    return item.id;
  }
  openEditModal(tableType: string, item: ManagementItem) {
    this.currentTableType = tableType;
    this.modalTitle = `Edit ${this.tables[tableType].title.slice(0, -1)}`;
    this.modalItemName = item.name;
    this.isEditMode = true;
    this.currentEditId = item.id;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalTitle = '';
    this.modalItemName = '';
    this.isEditMode = false;
    this.currentEditId = null;
    this.currentTableType = '';
  }

  saveItem() {
    if (!this.modalItemName.trim()) {
      alert('Please enter a name');
      return;
    }

    const table = this.tables[this.currentTableType];
    const payload = { name: this.modalItemName.trim() };

    this.loaderService.show();

    if (this.isEditMode && this.currentEditId) {
      // Update existing item
      const endpoint = `${table.endpoint}/Update${table.endpoint}`;
      const updatePayload = { id: this.currentEditId, ...payload };

      this.apiService.PostcallWithToken(endpoint, updatePayload).subscribe({
        next: (response: any) => {
          this.loaderService.hide();
          if (response.responseCode === 200) {
            this.loadTableData(this.currentTableType);
            this.closeModal();
            this.theme.shownotification(`${this.modalItemName} has been updated.`, 'success');
          } else {
            this.theme.shownotification('Failed to update item: ' + response.responseMessage, 'error');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.theme.shownotification('Error updating item: ' + error.errorMessage, 'error');
        }
      });
    } else {
      // Add new item
      const endpoint = `${table.endpoint}/Add${table.endpoint}`;

      this.apiService.PostcallWithToken(endpoint, payload).subscribe({
        next: (response: any) => {
          this.loaderService.hide();
          if (response.responseCode === 200) {
            this.loadTableData(this.currentTableType);
            this.closeModal();
            this.theme.shownotification(`${this.modalItemName} has been added.`, 'success');
          } else {
            this.theme.shownotification('Failed to add item: ' + response.responseMessage, 'error');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.theme.shownotification('Error adding item: ' + error.errorMessage, 'error');
        }
      });
    }
  }

  deleteItem(tableType: string, item: ManagementItem) {
    this.theme.confirmationModal(item.name, () => {
     
    

    const table = this.tables[tableType];
    const endpoint = `${table.endpoint}/Delete${table.endpoint}?id=${item.id}`;

    this.loaderService.show();

    this.apiService.PostcallWithToken(endpoint, null).subscribe({
     next: (response: any) => {
        this.loaderService.hide();
        if (response.responseCode === 200) {
          this.loadTableData(tableType);
          this.theme.shownotification(`${item.name} has been deleted.`, 'success');
        } else {
          this.theme.shownotification('Failed to delete item: ' + response.errorMessage, 'error');
        }
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.theme.shownotification('Error deleting item: ' + error.errorMessage, 'error');
      }
    });
  });
  }

  getTableEntries(tableType: string): [string, TableConfig][] {
    return Object.entries(this.tables).filter(([key]) => key === tableType);
  }

  getAllTableEntries(): [string, TableConfig][] {
    return Object.entries(this.tables);
  }
  
}