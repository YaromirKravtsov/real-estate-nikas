import { AxiosResponse } from "axios";
import $api from "../http";

export interface PropertyForm {
  title: string;
  price: number;
  address: string;
  city: string;
  listingType: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  yearBuilt?: number;
  description?: string;
  agentId: number;
  images: File[];
}

export interface PropertyImage {
  id: number;
  propertyId: number;
  imageUrl: string;
  isMain: boolean;
  fullUrl: string;
}

export interface PropertyAgent {
  id: number;
  firstName: string;
  lastName: string;
}

export interface PropertyResponse {
  id: number;
  title: string;
  price: string;
  address: string;
  city: string;
  listingType: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  description: string;
  is_submission: boolean;
  agentId: number;
  images: PropertyImage[];
  agent: PropertyAgent;
}

export interface SearchPropertyDto {
  city?: string;
  listingType?: string;
  propertyType?: string;
  priceFrom?: number;
  priceTo?: number;
  page?: number;
  limit?: number;
}

export interface SearchResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

export default class PropertyService {
  static async createProperty(
    data: Omit<PropertyForm, "images">,
    images: File[]
  ): Promise<AxiosResponse> {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, String(value));
      }
    });
    images.forEach((file) => form.append("images", file));
    return $api.post("/properties", form);
  }

  static async getPropertyById(
    id: number
  ): Promise<AxiosResponse<PropertyResponse>> {
    return $api.get(`/properties/by-id/${id}`);
  }

  static async getAllProperties(): Promise<
    AxiosResponse<PropertyResponse[]>
  > {
    return $api.get("/properties");
  }

    static async search(
    params: SearchPropertyDto
  ): Promise<AxiosResponse<SearchResponse<PropertyResponse>>> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, String(value));
      }
    });
    return $api.get(`/properties/search?${query.toString()}`);
  }
}
