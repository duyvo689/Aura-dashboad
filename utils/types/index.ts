interface Role {
  id: string;
  phone: string;
  name: string;
  position: string;
  created_at: string;
  clinic_id: Clinic;
  active: boolean;
  verify: boolean;
}
export interface Patient {
  id: number;
  created_at: string;
  avatar: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}
export interface Doctor {
  id: string;
  name: string;
  phone: string;
  age: number;
  avatar: string;
  clinic_id: Clinic;
  created_at: string;
}
interface User {
  id: number;
  created_at: string;
  phone: string;
  avatar: string | null;
  name: string;
  zalo_id: string | null;
  status: CustomerStatus | null;
  details_status: CustomerStatus | null;
  interact_type: CustomerStatus | null;
  interact_result: CustomerStatus | null;
  address: string | null;
  district: string | null;
  live_chat: string | null;
  last_update: string | null;
  age: number | null;
  customer_resource: string | null;
  gender: string | null;
  clinic: string | null;
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
interface Booking {
  id: string;
  created_at?: Date;
  service_id: Service[];
  date: string;
  clinic_id: Clinic;
  time_type: string;
  patient_id: Patient;
  doctor_id: Doctor[];
  description: string;
  status: number;
  price: number;
  is_have_rebooking: boolean;
  old_booking_id?: Booking | null;
  image_details: string[] | null;
}
interface Checkout {
  created_at: string;
  booking_id: string;
  patient_id: string;
  totalPrice: number;
  is_rebooking: boolean;
  date: string;
  coupons_id?: Coupon;
  totalCoupon: number;
}
interface Coupon {
  id: string;
  created_at: string;
  name: string;
  description: string;
  image: string;
  percent?: number;
  price?: number;
  service_id?: Service;
  end_date: string;
  start_date: string;
}
interface CustomerStatus {
  id: string;
  created_at: string;
  active: boolean;
  name: string;
  type: string;
}
interface CustomerStatusGroup {
  status: CustomerStatus[];
  details_status: CustomerStatus[];
  interact_type: CustomerStatus[];
  interact_result: CustomerStatus[];
}

interface CustomerStatusReturn {
  group: CustomerStatusGroup;
  data: CustomerStatus[];
}
export type {
  Checkout,
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
  Booking,
  CustomerStatus,
  CustomerStatusReturn,
  CustomerStatusGroup,
};
