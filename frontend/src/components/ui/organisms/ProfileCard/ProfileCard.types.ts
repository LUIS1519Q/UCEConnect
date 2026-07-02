export interface ProfileCardProps {
  name: string;
  email: string;
  studentId: string;
  career: string;
  avatar?: string;
  onEdit?: () => void;
}