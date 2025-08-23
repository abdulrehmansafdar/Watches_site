import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { CardComponent, CardContentComponent } from '../../../components/card/card.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  Chart,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  DoughnutController,
  LineController,
  PolarAreaController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { 
  heroCurrencyDollar, 
  heroShoppingBag, 
  heroSquares2x2, 
  heroArchiveBox,
  heroArrowTrendingUp,
  heroArrowTrendingDown,
  heroExclamationTriangle,
  heroCheckCircle,
  heroPlus,
  heroChartBar
} from '@ng-icons/heroicons/outline';
import { ApiCallService } from '../../../services/api-call.service';
import { LoaderService } from '../../../services/loader.service';
Chart.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  DoughnutController,
  LineController,
  PolarAreaController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title
);

interface StockData {
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: string;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    BaseChartDirective, 
    NgIcon
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  viewProviders: [provideIcons({
    heroCurrencyDollar,
    heroShoppingBag,
    heroSquares2x2,
    heroArchiveBox,
    heroArrowTrendingUp,
    heroArrowTrendingDown,
    heroExclamationTriangle,
    heroCheckCircle,
    heroPlus,
    heroChartBar
  })]
})
export class DashboardComponent implements OnInit {
  lastUpdated = new Date();
  selectedPeriod = '30d';

  // Stock configuration
  maxStock = 3000;
  minStockThreshold = 30; // Below 30% is low
  mediumStockThreshold = 70; // Below 70% is medium

  // KPI Data
  totalRevenue = 485000;
  revenueGrowth = 12.5;
  totalOrders = 1247;
  orderGrowth = 8.3;
  totalProducts = 156;
  activeProducts = 142;
  totalStock = 2340;

  // Stock Status
  stockData: StockData = {
    inStock: 120,
    lowStock: 22,
    outOfStock: 14
  };

  stockStatus = {
    class: 'text-yellow-100',
    icon: 'heroExclamationTriangle',
    text: '22 items low stock'
  };

  // Low Stock Products
  lowStockProducts: Product[] = [
    {
      id: 1,
      name: 'Rolex Submariner',
      category: 'Luxury',
      stock: 2,
      image: '/assets/watches/rolex-sub.jpg'
    },
    {
      id: 2,
      name: 'Omega Speedmaster',
      category: 'Sport',
      stock: 3,
      image: '/assets/watches/omega-speed.jpg'
    },
    {
      id: 3,
      name: 'Seiko Prospex',
      category: 'Dive',
      stock: 1,
      image: '/assets/watches/seiko-prospex.jpg'
    }
  ];

  // Recent Orders
  recentOrders: Order[] = [
    {
      id: 'ORD-2024-001',
      customerName: 'John Smith',
      total: 25000,
      status: 'completed',
      date: new Date(2024, 7, 8)
    },
    {
      id: 'ORD-2024-002',
      customerName: 'Sarah Johnson',
      total: 15000,
      status: 'processing',
      date: new Date(2024, 7, 8)
    },
    {
      id: 'ORD-2024-003',
      customerName: 'Mike Wilson',
      total: 35000,
      status: 'shipped',
      date: new Date(2024, 7, 7)
    }
  ];

  // Stock Chart Data
  stockChartData: ChartData<'doughnut'> = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [{
      data: [this.stockData.inStock, this.stockData.lowStock, this.stockData.outOfStock],
      backgroundColor: [
        '#10B981', // Green
        '#F59E0B', // Yellow
        '#EF4444'  // Red
      ],
      borderWidth: 0,
      hoverOffset: 8
    }]
  };

  stockChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%'
  };

  // Sales Chart Data
  salesChartData: ChartData<'line'> = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Sales',
      data: [85000, 92000, 78000, 98000],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#3B82F6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6
    }]
  };

  salesChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return 'PKR ' + Number(value).toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Category Chart Data
  categoryChartData: ChartData<'bar'> = {
    labels: ['Luxury', 'Sport', 'Casual', 'Dive', 'Classic'],
    datasets: [{
      label: 'Sales',
      data: [45, 38, 32, 28, 25],
      backgroundColor: [
        '#8B5CF6',
        '#06B6D4',
        '#10B981',
        '#F59E0B',
        '#EF4444'
      ],
      borderRadius: 8,
      borderSkipped: false
    }]
  };

  categoryChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Brand Chart Data
  brandChartData: ChartData<'polarArea'> = {
    labels: ['Rolex', 'Omega', 'Seiko', 'Casio', 'Citizen'],
    datasets: [{
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ]
    }]
  };

  brandChartOptions: ChartConfiguration<'polarArea'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  constructor(
    private apiService: ApiCallService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.updateStockStatus();
  }

  loadDashboardData() {
    // Load dashboard data from API
    // This would typically call your backend API
    this.loaderService.show();
    
    // Simulate API call
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }

  updateStockStatus() {
    if (this.stockData.outOfStock > 0) {
      this.stockStatus = {
        class: 'text-red-100',
        icon: 'heroExclamationTriangle',
        text: `${this.stockData.outOfStock} out of stock`
      };
    } else if (this.stockData.lowStock > 0) {
      this.stockStatus = {
        class: 'text-yellow-100',
        icon: 'heroExclamationTriangle',
        text: `${this.stockData.lowStock} low stock`
      };
    } else {
      this.stockStatus = {
        class: 'text-green-100',
        icon: 'heroCheckCircle',
        text: 'All products in stock'
      };
    }
  }

  updateSalesChart() {
    // Update sales chart based on selected period
    let newData: number[] = [];
    let newLabels: string[] = [];

    switch (this.selectedPeriod) {
      case '7d':
        newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        newData = [12000, 15000, 18000, 14000, 22000, 25000, 20000];
        break;
      case '30d':
        newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        newData = [85000, 92000, 78000, 98000];
        break;
      case '90d':
        newLabels = ['Month 1', 'Month 2', 'Month 3'];
        newData = [285000, 320000, 298000];
        break;
    }

    this.salesChartData = {
      ...this.salesChartData,
      labels: newLabels,
      datasets: [{
        ...this.salesChartData.datasets[0],
        data: newData
      }]
    };
  }

  getOrderStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Get stock percentage
  getStockPercentage(): number {
    return Math.round((this.totalStock / this.maxStock) * 100);
  }

  // Get stock level category
 

  // Get stock status text
  getStockStatusText(): string {
    const percentage = this.getStockPercentage();
    if (percentage < this.minStockThreshold) return 'Low Stock';
    if (percentage < this.mediumStockThreshold) return 'Medium Stock';
    return 'High Stock';
  }



  // Get colors based on stock level
  getStockStatusColor(): any {
    const percentage = this.getStockPercentage();
    
    if (percentage < this.minStockThreshold) {
      // Low stock - Red
      return {
        strokeColor: '#EF4444',
        dotColor: 'bg-red-500',
        textColor: 'text-red-600 dark:text-red-400',
        cardBg: 'bg-red-50 dark:bg-red-900/20',
        badgeBg: 'bg-red-100 dark:bg-red-900/30',
        badgeText: 'text-red-700 dark:text-red-300',
        progressBg: 'bg-red-500'
      };
    } else if (percentage < this.mediumStockThreshold) {
      // Medium stock - Orange
      return {
        strokeColor: '#F59E0B',
        dotColor: 'bg-orange-500',
        textColor: 'text-orange-600 dark:text-orange-400',
        cardBg: 'bg-orange-50 dark:bg-orange-900/20',
        badgeBg: 'bg-orange-100 dark:bg-orange-900/30',
        badgeText: 'text-orange-700 dark:text-orange-300',
        progressBg: 'bg-orange-500'
      };
    } else {
      // High stock - Green
      return {
        strokeColor: '#10B981',
        dotColor: 'bg-green-500',
        textColor: 'text-green-600 dark:text-green-400',
        cardBg: 'bg-green-50 dark:bg-green-900/20',
        badgeBg: 'bg-green-100 dark:bg-green-900/30',
        badgeText: 'text-green-700 dark:text-green-300',
        progressBg: 'bg-green-500'
      };
    }
  }

  // Calculate circle circumference
  getCircumference(): string {
    const circumference = 2 * Math.PI * 40; // radius = 40
    return `${circumference} ${circumference}`;
  }

  // Calculate stroke dash offset for animation
  getStrokeDashoffset(): number {
    const circumference = 2 * Math.PI * 40;
    const percentage = this.getStockPercentage();
    return circumference - (percentage / 100) * circumference;
  }
}