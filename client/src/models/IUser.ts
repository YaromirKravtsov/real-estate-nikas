export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    role: 'admin' | 'user' | 'guest';  // Укажите все возможные значения роли
    profileImageUrl: string | null;
    profileImageFullUrl: string | null;
  }
  

export type RoleType = 'admin' | 'user' | ''