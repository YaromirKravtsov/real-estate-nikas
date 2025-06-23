import { IUser } from "./IUser";

// models/SearchPropertyDto.ts
export interface SearchPropertyDto {
  city?: string;
  listingType?: 'sale' | 'rent';
  propertyType?: string;
  priceFrom?: number;
  priceTo?: number;
  page?: number;
  limit?: number;
}


export interface CreatePropertyDto {
  title?: string;
  price: number;
  address: string;
  city: string;
  listingType: 'sale' | 'rent';
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  yearBuilt?: number;
  description?: string;
  agentId: number;
  is_submission: boolean;
  images?: any[]; // тільки для бекенд-DTO, тут ігноруємо
}

export interface IProperty {
  id: number;
  title: string;
  price: string;
  address: string;
  city: string;
  listingType: 'sale' | 'rent';
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  yearBuilt?: number;
  description?: string;
  is_submission: boolean;
  agentId: number;
  agent?: IUser
  images: PropertyImage[]; // URL-адреси
}


export interface IPaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}
export interface PropertyImage {
  id: number;
  propertyId: number;
  imageUrl: string;
  isMain: boolean;
  fullUrl: string;
}
