interface Role {
  phone: string;
  position: string;
  createdAt?: string;
}

interface User {
  id: number;
  created_at: string;
  phone: string;
  avatar: string;
  name: string;
}
interface Banner {
  id: string;
  created_at: string;
  image_url: string;
  order: number;
}
interface Clinic {
  id: string;
  created_at: string;
  name_clinic: string;
  avatar: string;
  address: string;
  description: string;
}

export type { Role, User, Banner, Clinic };
