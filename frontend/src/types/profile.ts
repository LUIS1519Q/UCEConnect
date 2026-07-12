export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  faculty?: { id: number; name: string };
  career?: { id: number; name: string };
  avatarUrl?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  facultyId?: number;
  careerId?: number;
}

export interface Faculty {
  id: number;
  name: string;
}

export interface Career {
  id: number;
  name: string;
}