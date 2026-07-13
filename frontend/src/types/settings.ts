export interface AppSettings {
  applicationName: string;
  contactEmail: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  logoUrl?: string;
}

export interface UpdateSettingsRequest {
  applicationName?: string;
  contactEmail?: string;
  maxFileSize?: number;
  allowedFileTypes?: string[];
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  order: number;
}

export interface UpdateFAQRequest {
  question?: string;
  answer?: string;
  order?: number;
}