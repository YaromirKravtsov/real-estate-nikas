import { SubmitPropertyDto } from "../../../app/api/service/PropertyRequestsService";

export function buildFormData(data: SubmitPropertyDto,images: File[]): FormData {
  const fd = new FormData();

  // Прості поля (виключаємо images)
  for (const [key, value] of Object.entries(data)) {
    if (key === 'images' || value === undefined || value === null) continue;

    // Усі значення — рядки (FormData не любить числа): приводимо до string
    fd.append(key, String(value));
  }

  // Додаємо кожен файл окремо під ключем "images"
  if (images && images.length) {
    images.forEach((file) => {
      fd.append('images', file);
    });
  }

  return fd;
}

