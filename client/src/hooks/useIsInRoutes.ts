// src/hooks/useIsInRoutes.ts
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../app/store/auth';
import { adminRoutes } from '../app/router';

export function useIsAdminPage() {
  const { pathname } = useLocation();
  const { role } = useAuthStore();

  // якщо передано allowRole — дозволяємо лише цьому role
  console.log(role)
  if (role !== 'admin') {
    return false;
  }
  const path = '/' + pathname.split('/')[1]
    console.log(path)
  // перевіряємо, чи поточний шлях у списку
  return adminRoutes.map(r => r.path).includes(path);
}
