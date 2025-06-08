export interface SearchPropertyDto {
  city?: string;
  listingType?: string;
  propertyType?: string;
  priceFrom?: number;
  priceTo?: number;
  page?: number;
  limit?: number;
}

export interface CreatePropertyDto {
  title: string;
  description: string;
  city: string;
  address: string;
  listingType: string;
  propertyType: string;
  price: number;
  agentId: number;
}

export interface UpdatePropertyDto extends Partial<CreatePropertyDto> {}

const API_BASE = 'http://localhost:5000/properties';

export async function searchProperties(params: SearchPropertyDto) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.append(key, String(value));
  });

  try {
    const res = await fetch(`${API_BASE}/search?${query.toString()}`);
    if (!res.ok) {
      let errorMessage = `Помилка ${res.status}: ${res.statusText}`;
      console.log(errorMessage)
      try {
        const errorData = await res.json();
        if (errorData?.message) {
          errorMessage += ` — ${errorData.message}`;
        }
      } catch {
      }
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    console.log(data)
    return data;
  } catch (error) {
    throw error;
  }
}



export async function getProperty(id: number) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Обʼєкт не знайдено');
  return res.json();
}

export async function getUserSubmittedProperties(agentId: number) {
  const res = await fetch(`${API_BASE}/user/${agentId}`);
  if (!res.ok) throw new Error('Не вдалося отримати обʼєкти користувача');
  return res.json();
}

export async function createProperty(data: CreatePropertyDto, images: File[]) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
  images.forEach((img) => {
    formData.append('images', img);
  });

  const res = await fetch(`${API_BASE}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Не вдалося створити обʼєкт');
  return res.json();
}

export async function updateProperty(id: number, data: UpdatePropertyDto, images?: File[]) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  if (images) {
    images.forEach((img) => {
      formData.append('images', img);
    });
  }

  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!res.ok) throw new Error('Не вдалося оновити обʼєкт');
  return res.json();
}

export async function deleteProperty(id: number) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Не вдалося видалити обʼєкт');
  return res.json();
}
