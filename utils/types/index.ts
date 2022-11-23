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
  link: string;
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
  category_id: string;
}

interface Category {
  id: string;
  created_at: string;
  name: string;
}
interface Payment {
  id: string;
  created_at: string;
  name: string;
  image: string;
}
interface Customer {
  id: string;
  created_at: string;
  name: string;
}

interface OpenModal {
  isOpen: boolean;
  id: string;
  name: string;
}
export type { Role, User, Banner, Clinic, Service ,Category,Payment,Customer,OpenModal};
