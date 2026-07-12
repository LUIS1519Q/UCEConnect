import type { AppSettings, FAQItem } from "../types/settings";

export const mockSettings: AppSettings = {
  applicationName: "UCEConnect",
  contactEmail: "support@uceconnect.edu.ec",
  maxFileSize: 10,
  allowedFileTypes: ["pdf", "jpg", "png"],
  logoUrl: undefined,
};

export const mockFAQItems: FAQItem[] = [
  { id: 1, question: "How do I submit an incident?", answer: "Go to Incidents and tap \"New incident\".", order: 1 },
  { id: 2, question: "How long does resolution take?", answer: "Depends on category and priority level.", order: 2 },
  { id: 3, question: "Can I track my incident status?", answer: "Yes, check the status in your incident history.", order: 3 },
];