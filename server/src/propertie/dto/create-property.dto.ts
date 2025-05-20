export class CreatePropertyDto {
  title?: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  yearBuilt?: number;
  description?: string;
  agentId: number;
}
