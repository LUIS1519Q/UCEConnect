import type { Profile } from "../types/profile";

export const mockProfile: Profile = {
  id: 1,
  firstName: "Juan",
  lastName: "Pérez",
  email: "juan@uce.edu.ec",
  role: "student",
  phone: "+593987654321",
  faculty: { id: 3, name: "Facultad de Ingeniería y Ciencias Aplicadas" },
  career: { id: 8, name: "Ingeniería en Sistemas" },
  avatarUrl: undefined,
};