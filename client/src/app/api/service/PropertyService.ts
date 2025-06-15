import { AxiosResponse } from "axios";
import $api from "../http";

// Для отправки формы при создании/редактировании
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
  images: File[]; // Только файлы для отправки
}

// Структура изображения в ответе от сервера
export interface PropertyImage {
  id: number;
  propertyId: number;
  imageUrl: string;
  isMain: boolean;
  fullUrl: string;
}

// Структура, возвращаемая с бэкенда
export interface PropertyResponse {
  id: number;
  title: string;
  price: string; // Обрати внимание: приходит как строка
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
  static async getAllProperties(): Promise<AxiosResponse<PropertyResponse[]>> {
    return $api.get("/properties");
  }
}
