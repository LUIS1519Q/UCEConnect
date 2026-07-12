export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface GetHelpResponse {
  faqs: FAQ[];
  supportEmail: string;
}

export interface GetAboutResponse {
  appName: string;
  version: string;
  description: string;
  institution: string;
  contactEmail: string;
  developedBy: string;
}