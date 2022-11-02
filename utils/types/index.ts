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

export type { Role, User };
