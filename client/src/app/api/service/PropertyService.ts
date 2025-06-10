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
}
