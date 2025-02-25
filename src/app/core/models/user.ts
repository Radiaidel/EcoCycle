
export interface User {
    id: number;
    email: string;
    password: string;
    fullName: string;
    address: string;
    city: string;
    phone: string;
    birthDate: string;
    profilePicture?: string;  
    role: 'particulier' | 'collecteur';
    points: number | 0;
  }
  