import { useNavigate } from "react-router-dom";

import { Logo } from "../../components/ui/atoms/Logo";
import { Button } from "../../components/ui/atoms/Button";
import { FAQSection } from "../../components/ui/organisms/FAQSection";

import {
  FilePlus2,
  Search,
  MessageSquare,
  Bell,
  CheckCircle,
  Phone,
  Share2,
  Users,
  CheckCircle2,
} from "../../components/ui/icons";

import { ROUTES } from "../../constants/routes";

const HOW_IT_WORKS = [
   {
     icon: FilePlus2,
     title: "Report",
     description: "Submit a new incident with title, description and evidence.",
   },
   {
     icon: Search,
     title: "Track",
     description: "Follow the status of your case from open to resolution.",
   },
   {
     icon: MessageSquare,
     title: "Chat",
     description: "Respond directly when a manager requests more information.",
   },
   {
     icon: CheckCircle,
     title: "Resolve",
     description: "Get notified once your incident reaches a final outcome.",
   },
];

const KEY_FEATURES = [
  {
    icon: Search,
    title: "Similar incident detection",
    description: "AI checks for related reports before you submit, avoiding duplicates.",
  },
  {
    icon: MessageSquare,
    title: "Live chat with managers",
    description: "Respond directly to follow-up requests in real time.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Get notified the moment your incident status changes.",
  },
];

const LANDING_FAQS = [
  {
    question: "Who can use UCEConnect?",
    answer:
      "Any student at Universidad Central del Ecuador can register and report incidents through the platform.",
  },
  {
    question: "How long does it take to get a response?",
    answer:
      "Response times vary by incident type, but managers typically review new reports within a few business days.",
  },
  {
    question: "Is my information kept private?",
    answer:
      "Yes, incident details are only visible to you and the assigned manager reviewing your case.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}

      <header className="border-b border-border bg-primary">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

          <Logo
            variant="horizontal-white"
            className="w-44"
          />

          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => navigate(ROUTES.auth.login)}>
              Login
            </Button>

            <Button onClick={() => navigate(ROUTES.auth.register)}>
              Register
            </Button>
          </div>

        </div>
      </header>

      {/* Logo + Problem/Solution + Hero closing */}
      <section className="bg-surface px-8 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Logo variant="horizontal-slogan-color" className="mx-auto h-40" />

          <h1 className="mb-6 text-4xl font-bold text-textPrimary">
            Report university incidents easily
          </h1>

        </div>

        <div className="mx-auto mt-14 max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2">

            <div className="rounded-xl border border-border bg-background p-6">
              <div className="relative mb-6 flex h-32 items-center justify-center">
                <div className="absolute -rotate-12 rounded-lg border border-border bg-surface p-2.5 shadow-sm">
                  <MessageSquare size={20} className="text-textSecondary" />
                </div>
                <div className="absolute left-6 top-0 rotate-6 rounded-lg border border-border bg-surface p-2.5 shadow-sm">
                  <Phone size={20} className="text-textSecondary" />
                </div>
                <div className="absolute right-4 top-2 rotate-12 rounded-lg border border-border bg-surface p-2.5 shadow-sm">
                  <Share2 size={20} className="text-textSecondary" />
                </div>
                <div className="absolute bottom-0 right-8 -rotate-6 rounded-lg border border-border bg-surface p-2.5 shadow-sm">
                  <Users size={20} className="text-textSecondary" />
                </div>
              </div>

              <h3 className="mb-2 font-semibold text-textPrimary">Before</h3>
              <p className="text-sm text-textSecondary">
                Incidents were reported through scattered channels like
                social media, private messages and in-person visits, making
                it hard to track, control and resolve cases on time.
              </p>
            </div>

            <div className="rounded-xl border border-primary bg-background p-6">
              <div className="mb-6 flex h-32 items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 size={32} className="text-primary" />
                </div>
              </div>

              <h3 className="mb-2 font-semibold text-textPrimary">
                With UCEConnect
              </h3>
              <p className="text-sm text-textSecondary">
                A single centralized channel with formal tracking for every
                case, from submission to resolution.
              </p>
            </div>

          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">

          <p className="mb-10 text-lg text-textSecondary">
            UCEConnect is an intelligent platform for managing and analyzing
            student incidents at FEUE-UCE, centralizing reports that were
            previously scattered across social media, private messages and
            in-person visits.
          </p>

          <Button size="lg" onClick={() => navigate(ROUTES.auth.login)}>
            Get Started
          </Button>
        </div>
      </section>

      {/* How it works */}

      <section className="px-8 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-textPrimary">
            How it works
          </h2>

         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
           {HOW_IT_WORKS.map(({ icon: Icon, title, description }) => (
             <div key={title} className="rounded-xl border border-border bg-surface p-6">
               <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                 <Icon size={20} className="text-primary" />
               </div>
               <h3 className="mb-2 font-semibold text-textPrimary">
                 {title}
               </h3>
               <p className="text-sm text-textSecondary">
                 {description}
               </p>
             </div>
           ))}
         </div>
        </div>
      </section>

      {/* Key features */}

      <section className="border-t border-border bg-surface px-8 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-textPrimary">
            Key features
          </h2>

         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
           {KEY_FEATURES.map(({ icon: Icon, title, description }) => (
             <div key={title} className="rounded-xl border border-border bg-surface p-6">
               <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                 <Icon size={20} className="text-primary" />
               </div>
               <h3 className="mb-2 font-semibold text-textPrimary">
                 {title}
               </h3>
               <p className="text-sm text-textSecondary">
                 {description}
               </p>
             </div>
           ))}
         </div>
        </div>
      </section>

      {/* FAQ */}

      <section className="px-8 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-textPrimary">
            Frequently asked questions
          </h2>

          <FAQSection faqs={LANDING_FAQS} />
        </div>
      </section>

      {/* Footer */}

      <footer className="border-t border-border px-8 py-10 text-sm text-textSecondary">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span>© 2026 UCEConnect · FEUE-UCE</span>

          <div className="flex gap-6">
            <a href="mailto:support@uceconnect.edu.ec" className="hover:text-textPrimary">
              Contact
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}