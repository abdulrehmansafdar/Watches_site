import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

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
  constructor(private apicall:ApiCallService) { }
  getDropdownData(type: string, endpoint: string) {
  return this.apicall.GetcallWithToken(`${type}/${endpoint}`);
}
}
