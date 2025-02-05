
export interface User {
    id: number;
    email: string;
    password: string;
    fullName: string;
    address: string;
    city: string;
    phone: string;
    birthDate: Date;
    profilePicture?: string;  // Optionnel
    role: 'particulier' | 'collecteur';
  }
  