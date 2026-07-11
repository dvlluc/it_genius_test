export type UserAddress = {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
};

export type UserCompany = {
  name: string;
  department?: string;
  title?: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  company: UserCompany;
  address: UserAddress;
};

export type UsersResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

export type UserStatus = "active" | "inactive" | "pending";

export type UserListParams = {
  limit?: number;
  skip?: number;
  q?: string;
  sortBy?: string;
  order?: "asc" | "desc";
};

export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function deriveUserStatus(user: User): UserStatus {
  const mod = user.id % 3;
  if (mod === 0) return "pending";
  if (mod === 1) return "inactive";
  return "active";
}
