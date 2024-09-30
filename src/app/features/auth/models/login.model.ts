export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  name: string;
  email?: string;
  phone?: string;
  refreshToken: string;
}

export interface LoginForm extends LoginRequest {
  remember?: boolean;
}