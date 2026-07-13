export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface GetHelpResponse {
  pageTitle: string;
  pageDescription: string;
  supportEmail: string;
  items: FAQItem[];
}

export interface AboutContact {
  email: string;
  website: string;
}

export interface GetAboutResponse {
  applicationName: string;
  version: string;
  description: string;
  institution: string;
  contact: AboutContact;
  developedBy: string;
  copyright: string;
}