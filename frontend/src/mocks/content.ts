import type { GetHelpResponse, GetAboutResponse } from "../types/content";

export const mockHelpResponse: GetHelpResponse = {
  supportEmail: "support@uceconnect.edu.ec",
  faqs: [
    {
      id: 1,
      question: "How do I create an incident?",
      answer:
        "Go to 'New Incident' in the sidebar, fill in the title and description, and submit. You can attach evidence files if needed.",
    },
    {
      id: 2,
      question: "Can I edit my incident after submitting?",
      answer:
        "Yes, as long as the incident status is still 'Open'. Once a manager starts reviewing it, editing is no longer available.",
    },
    {
      id: 3,
      question: "How long does it take to get a response?",
      answer:
        "Response times vary depending on the type of incident, but managers typically review new incidents within a few business days.",
    },
    {
      id: 4,
      question: "What happens if my incident is rejected?",
      answer:
        "You'll receive a notification explaining the reason. You can create a new incident with additional information if needed.",
    },
    {
      id: 5,
      question: "How do I respond to a manager request?",
      answer:
        "If a manager requests more information, you'll see a notification and a 'Respond to manager request' option on the incident detail page.",
    },
  ],
};

export const mockAboutResponse: GetAboutResponse = {
  appName: "From claim to solution.",
  version: "1.0.0",
  description:
    "UCEConnect is an intelligent platform for managing and analyzing student incidents at FEUE-UCE, centralizing reports that were previously scattered across social media, private messages and in-person visits.",
  institution: "Facultad de Ingeniería y Ciencias Aplicadas, Universidad Central del Ecuador",
  contactEmail: "support@uceconnect.edu.ec",
  developedBy: "UCEConnect Team — FEUE-UCE",
};