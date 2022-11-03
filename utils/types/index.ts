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
  name: string;
  avatar: string;
  address: string;
  description: string;
}
interface Service {
  id: string;
  created_at: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export type { Role, User, Banner, Clinic, Service };
