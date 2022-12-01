interface Role {
  id: string;
  phone: string;
  name: string;
  position: string;
  created_at: string;
  clinic_id: Clinic;
  active: boolean;
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
}
interface Clinic {
  id: string;
  created_at: string;
  name: string;
  avatar: string;
  address: string;
  description: string;
  active: boolean;
}
interface Service {
  id: string;
  created_at: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category_id: Category;
  active: true;
}

interface Category {
  id: string;
  created_at: string;
  name: string;
  active: true;
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
interface Coupon {
  id: string;
  created_at: string;
  name: string;
  image: string;
  price?: number;
  percent?: number;
  start_date: string;
  end_date: string;
  description: string;
  active: boolean;
  service_id?: Service;
}
interface OpenModal {
  isOpen: boolean;
  id: string;
  name: string;
}
export type {
  Coupon,
  Role,
  User,
  Banner,
  Clinic,
  Service,
  Category,
  Payment,
  Customer,
  OpenModal,
};
