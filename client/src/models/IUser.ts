export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    role: 'admin' | 'user' | 'guest';  // Укажите все возможные значения роли
    avatarLink: string | null;
  }
  

export type RoleType = 'admin' | 'user' | ''