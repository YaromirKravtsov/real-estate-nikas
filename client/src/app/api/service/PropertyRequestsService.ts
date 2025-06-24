import { AxiosRequestConfig, AxiosResponse } from "axios";
import $api from "../http";

export type ListingType = 'sale' | 'rent';

export interface SubmitPropertyDto {
  // ---- Property fields ----
  title: string;
  price: number;
  address: string;
  city: string;
  listingType: ListingType;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  yearBuilt?: number;
  description: string;
  agentId: number;
  is_submission: boolean;

  // ---- Contact fields ----
  name: string;
  email: string;
  phone: string;
  message: string;
}
// Тип для агента
export interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  profileImageUrl: string;
  role: 'admin' | 'user' | 'agent'; // за потреби можна додати інші ролі
  phoneNumber: string;
}

// Тип для об’єкта нерухомості
export interface Property {
  id: number;
  title: string;
  price: string;              // приходить як рядок "450000.00"
  address: string;
  city: string;
  listingType: 'sale' | 'rent';
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  description: string;
  is_submission: boolean;
  agentId: number;
  agent: Agent;
}

// Тип для одного запиту користувача
export interface UserPropertyRequest {
  id: number;
  propertyId: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  requestType: number;        // за потреби можна замінити на enum
  createdAt: string | null;
  property: Property;
}

export interface ViewReq {
  
  name: string,
  email: string,
  phone: string,
  propertyId?: number

}
// Тип відповіді — масив таких запитів
export class PropertyRequestsService{
    static async submitPorperty(dto: FormData){
        await $api.post('property-views/submit', dto)
    }
    static async getSubmitPorperty(type = 2): Promise<AxiosResponse<UserPropertyRequest[]>>{
        return await $api.get('property-views/search?requestType=' + type)
    }

  static async changeSubmitPropertyAction(
    reqId: number,
    action: 'approve' | 'reject'
  ): Promise<AxiosResponse<UserPropertyRequest[]>> {
    return await $api.put(
      `property-views/submit/action/${reqId}`,
      { action }
    );
  }

  /** Схвалити заявку */
  static async approveSubmitProperty(
    reqId: number
  ): Promise<AxiosResponse<UserPropertyRequest[]>> {
    return this.changeSubmitPropertyAction(reqId, 'approve');
  }

  /** Відхилити заявку */
  static async rejectSubmitProperty(
    reqId: number
  ): Promise<AxiosResponse<UserPropertyRequest[]>> {
    return this.changeSubmitPropertyAction(reqId, 'reject');
  }


   static async viewRequest(
    viewRequestDto: ViewReq
  ) {
     await $api.post('property-views/view', viewRequestDto)
  }



    
}