import { useState } from "react";
import {
  FileText,
  FilePlus2,
  User,
  CircleHelp,
  LogOut,
  Info,
} from "../../components/ui/icons";

import { Textarea } from "../../components/ui/atoms/Textarea";
import { StatusBadge } from "../../components/ui/atoms/StatusBadge";
import { FileChip } from "../../components/ui/atoms/FileChip";
import { Avatar } from "../../components/ui/atoms/Avatar";
import { SearchBar } from "../../components/ui/molecules/SearchBar";
import { IncidentCard } from "../../components/ui/molecules/IncidentCard";
import { EvidenceItem } from "../../components/ui/molecules/EvidenceItem";
import { NotificationItem } from "../../components/ui/molecules/NotificationItem";
import { ProfileInfoItem } from "../../components/ui/molecules/ProfileInfoItem";
import { FAQItem } from "../../components/ui/molecules/FAQItem";
import { Tabs } from "../../components/ui/molecules";
import { ChatBubble } from "../../components/ui/molecules/ChatBubble";
import { SimilarIncidentBanner } from "../../components/ui/molecules/SimilarIncidentBanner";
import { Pagination } from "../../components/ui/molecules/Pagination";
import { IncidentList } from "../../components/ui/organisms/IncidentList";
import { ProfileCard } from "../../components/ui/organisms/ProfileCard";
import { NotificationList } from "../../components/ui/organisms/NotificationList";
import { FAQSection } from "../../components/ui/organisms/FAQSection";
import { EvidenceSection } from "../../components/ui/organisms/EvidenceSection";
//import { Modal } from "../../components/ui/organisms";
import { Timeline } from "../../components/ui/organisms/Timeline";
import { ConversationThread } from "../../components/ui/organisms";
import { AppHeader } from "../../components/ui/organisms/AppHeader";
import { AppSidebar } from "../../components/ui/organisms";
import { AppLayout } from "../../components/ui/templates";
//import { Button } from "../../components/ui/atoms";

export default function StudentShowcase() {
  const [selectedTab, setSelectedTab] =
    useState("open");
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-10">
        <header>
          <h1 className="text-3xl font-bold text-textPrimary">
            Student UI Showcase
          </h1>

          <p className="mt-2 text-textSecondary">
            Playground for Student UI components.
          </p>
        </header>

        {/* ===================== ATOMS ===================== */}
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-textPrimary">
            Atoms
          </h2>

            <div className="mt-6 space-y-6">
                <div>
                    <h3 className="mb-2 text-lg font-medium text-textPrimary">
                    Textarea
                    </h3>

                    <Textarea placeholder="Describe el problema..." />
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-medium text-textPrimary">
                    Status Badge
                </h3>

                <div className="flex flex-wrap gap-3">
                    <StatusBadge status="open" />
                    <StatusBadge status="inProgress" />
                    <StatusBadge status="resolved" />
                    <StatusBadge status="rejected" />
                </div>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">
                FileChip
              </h2>

              <div className="flex flex-wrap gap-4">
                <FileChip
                  fileName="Complaint.pdf"
                  fileType="pdf"
                />

                <FileChip
                  fileName="Evidence.jpg"
                  fileType="image"
                />

                <FileChip
                  fileName="Grades.xlsx"
                  fileType="xlsx"
                />

                <FileChip
                  fileName="Unknown.zip"
                  fileType="other"
                />
              </div>
            </section>

            <div>
                <h3 className="mb-4 text-lg font-medium text-textPrimary">
                    Avatar
                </h3>

                <div className="flex items-center gap-4">
                    <Avatar alt="Student avatar" size="sm" />
                    <Avatar alt="Student avatar" size="md" />
                    <Avatar alt="Student avatar" size="lg" />
                </div>
            </div>

        </section>

        {/* ===================== MOLECULES ===================== */}
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-textPrimary">
            Molecules
          </h2>

            <div>
              <h3 className="mb-4 text-lg font-medium text-textPrimary">
                Search Bar
              </h3>

              <SearchBar placeholder="Search incidents..." />
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-textPrimary">
                Incident Card
              </h3>

              <IncidentCard
                id="INC-0001"
                title="Internet connection issue"
                location="Building A - Lab 3"
                status="open"
                createdAt="Jun 29, 2026"
              />
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">
                EvidenceItem
              </h2>

              <div className="space-y-3">
                <EvidenceItem
                  fileName="Complaint.pdf"
                  fileType="pdf"
                  fileSize="1.2 MB"
                />

                <EvidenceItem
                  fileName="Evidence.jpg"
                  fileType="image"
                  fileSize="2.8 MB"
                  onClick={() => alert("Open evidence")}
                />

                <EvidenceItem
                  fileName="Grades.xlsx"
                  fileType="xlsx"
                  fileSize="180 KB"
                  onRemove={() => alert("Remove")}
                />
              </div>
            </section>

            <div>
              <h3 className="mb-4 text-lg font-medium text-textPrimary">
                Notification Item
              </h3>

              <NotificationItem
                title="Incident Updated"
                message="Your incident status has changed to In Progress."
                date="2 hours ago"
                unread
              />
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-textPrimary">
                Profile Info Item
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <ProfileInfoItem
                  label="Student ID"
                  value="2023123456"
                />

                <ProfileInfoItem
                  label="Career"
                  value="Software Engineering"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-textPrimary">
                FAQ Item
              </h3>

              <FAQItem
                question="How can I create a new incident?"
                answer="Go to the Create Incident page, fill out the form, attach any evidence if needed, and submit your report."
              />
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-textPrimary">
                Tabs
              </h2>

              <Tabs
                tabs={[
                  {
                    label: "Open",
                    value: "open",
                  },
                  {
                    label: "In Progress",
                    value: "progress",
                  },
                  {
                    label: "Resolved",
                    value: "resolved",
                  },
                ]}
                value={selectedTab}
                onChange={setSelectedTab}
              />
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">
                ChatBubble
              </h2>

              <div className="space-y-4 rounded-xl border border-border p-6">
                <ChatBubble
                  sender="Case Manager"
                  senderType="manager"
                  timestamp="Jun 24, 2026 • 10:35 AM"
                  message="Please upload your academic transcript to continue reviewing your incident."
                />

                <ChatBubble
                  sender="John Doe"
                  senderType="student"
                  timestamp="Jun 24, 2026 • 10:42 AM"
                  message="Sure. I have attached the requested document."
                />
              </div>
            </section> 

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">
                SimilarIncidentBanner
              </h2>

              <SimilarIncidentBanner
                title="Similar incident detected"
                description="A similar incident has already been reported. Please review it before submitting a new one."
                onViewDetails={() => alert("View details")}
                onDismiss={() => alert("Dismiss")}
              />
            </section>           

           <section className="space-y-4">
              <h2 className="text-2xl font-bold">
                Pagination
              </h2>

              <Pagination
                currentPage={3}
                totalPages={12}
                onPageChange={() => {}}
              />
            </section>

        </section>

        {/* ===================== ORGANISMS ===================== */}
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-textPrimary">
            Organisms
          </h2>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-textPrimary">
              Incident List
            </h2>
            <IncidentList
              incidents={[
                {
                  id: "INC-0001",
                  title: "Internet connection issue",
                  location: "Building A - Lab 3",
                  status: "open",
                  createdAt: "Jun 29, 2026",
                },
                {
                  id: "INC-0002",
                  title: "Projector not working",
                  location: "Building B - Room 201",
                  status: "inProgress",
                  createdAt: "Jun 28, 2026",
                },
              ]}
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-textPrimary">
              Profile Card
            </h2>

            <ProfileCard
              name="John Doe"
              email="john.doe@uce.edu.ec"
              studentId="2023123456"
              career="Software Engineering"
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-textPrimary">
              Notification List
            </h2>

            <NotificationList
              notifications={[
                {
                  title: "Incident Updated",
                  message: "Your incident is now in progress.",
                  date: "2 hours ago",
                  unread: true,
                },
                {
                  title: "Incident Resolved",
                  message: "Your incident has been resolved.",
                  date: "Yesterday",
                },
              ]}
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-textPrimary">
              FAQ Section
            </h2>

            <FAQSection
              faqs={[
                {
                  question: "How do I create an incident?",
                  answer:
                    "Go to Create Incident, complete the form and submit it.",
                },
                {
                  question: "Can I edit an incident?",
                  answer:
                    "Yes, while it has not been resolved.",
                },
              ]}
            />
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">
              EvidenceSection
            </h2>

            <EvidenceSection
              title="Attached Evidence"
              onAddFile={() => alert("Add evidence")}
              files={[
                {
                  fileName: "Complaint.pdf",
                  fileType: "pdf",
                  fileSize: "1.2 MB",
                },
                {
                  fileName: "Evidence.jpg",
                  fileType: "image",
                  fileSize: "2.8 MB",
                  onRemove: () => alert("Remove"),
                },
                {
                  fileName: "Grades.xlsx",
                  fileType: "xlsx",
                  fileSize: "180 KB",
                },
              ]}
            />
          </section>

          <section className="space-y-4">
              <h2 className="text-2xl font-bold">Modal</h2>

              {/*<Modal
                open
                title="Cancel incident"
                footer={
                  <div className="flex flex-col gap-3">
                    <Button variant="secondary">
                      Keep incident
                    </Button>

                    <Button variant="danger">
                      Yes, cancel incident
                    </Button>
                  </div>
                }
              >
                <p className="text-textSecondary">
                  Are you sure you want to cancel this incident?
                  This action cannot be undone.
                </p>
              </Modal>*/}
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">
              Timeline
            </h2>

            <Timeline
              items={[
                {
                  id: "1",
                  title: "Incident created",
                  description: "The incident was submitted.",
                  timestamp: "Jun 24, 2026 • 10:30 AM",
                },
                {
                  id: "2",
                  title: "Manager requested evidence",
                  description: "Please attach your transcript.",
                  timestamp: "Jun 25, 2026 • 09:15 AM",
                },
                {
                  id: "3",
                  title: "Student responded",
                  description: "Transcript attached.",
                  timestamp: "Jun 25, 2026 • 11:40 AM",
                },
                {
                  id: "4",
                  title: "Incident resolved",
                  timestamp: "Jun 26, 2026 • 04:20 PM",
                },
              ]}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">
              ConversationThread
            </h2>

            <ConversationThread
              messages={[
                {
                  sender: "Case Manager",
                  senderType: "manager",
                  message:
                    "Please upload your academic transcript.",
                  timestamp: "Jun 24, 2026 • 10:35 AM",
                },
                {
                  sender: "John Doe",
                  senderType: "student",
                  message:
                    "Sure. I have attached the requested document.",
                  timestamp: "Jun 24, 2026 • 10:42 AM",
                },
                {
                  sender: "Case Manager",
                  senderType: "manager",
                  message:
                    "Thank you. We will review it shortly.",
                  timestamp: "Jun 24, 2026 • 11:05 AM",
                },
              ]}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">
              AppHeader
            </h2>

            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <AppHeader
                studentName="John Doe"
                notificationCount={3}
                onNotificationsClick={() => {}}
                onProfileClick={() => {}}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">
              AppSidebar
            </h2>

            <div className="h-screen overflow-hidden rounded-xl border border-border">
              <AppSidebar
                primaryAction={{
                  label: "New Incident",
                  icon: FilePlus2,
                }}
                items={[
                  {
                    label: "My Incidents",
                    icon: FileText,
                    active: true,
                  },
                  {
                    label: "Profile",
                    icon: User,
                  },
                  {
                    label: "Help",
                    icon: CircleHelp,
                  },
                  {
                    label: "About",
                    icon: Info,
                  },
                ]}
                bottomItems={[
                  {
                    label: "Logout",
                    icon: LogOut,
                  },
                ]}
              />
            </div>
          </section>

        </section>

        {/* ===================== TEMPLATES ===================== */}
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-textPrimary">
            Templates
          </h2>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">
              AppLayout
            </h2>

            <div
              className="
                h-[850px]
                overflow-auto
                rounded-xl
                border
                border-border
                bg-surface
                shadow-sm
              "
            >
              <AppLayout
                title="My Incidents"
                studentName="John Doe"
                notificationCount={3}
                primaryAction={{
                  label: "New Incident",
                  icon: FilePlus2,
                }}
                sidebarItems={[
                  {
                    label: "My Incidents",
                    icon: FileText,
                    active: true,
                  },
                  {
                    label: "Profile",
                    icon: User,
                  },
                  {
                    label: "Help",
                    icon: CircleHelp,
                  },
                  {
                    label: "About",
                    icon: Info,
                  },
                ]}
                bottomItems={[
                  {
                    label: "Logout",
                    icon: LogOut,
                  },
                ]}
              >
                <div className="space-y-6">
                  <SearchBar
                    placeholder="Search incidents..."
                  />

                  <IncidentList
                    incidents={[
                      {
                        id: "INC-0001",
                        title: "Projector not working",
                        location: "Building A - Room 204",
                        status: "open",
                        createdAt: "05 Jul 2026",
                      },
                      {
                        id: "INC-0002",
                        title: "Broken chair",
                        location: "Building C - Room 102",
                        status: "inProgress",
                        createdAt: "04 Jul 2026",
                      },
                      {
                        id: "INC-0003",
                        title: "Internet outage",
                        location: "Computer Lab",
                        status: "resolved",
                        createdAt: "02 Jul 2026",
                      },
                    ]}
                  />

                  <Pagination
                    currentPage={1}
                    totalPages={5}
                    onPageChange={() => {}}
                  />
                </div>
              </AppLayout>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}