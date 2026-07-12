import { Avatar } from "../../atoms/Avatar";
import { Button } from "../../atoms/Button";

import { ProfileInfoItem } from "../../molecules/ProfileInfoItem";

import type { ProfileCardProps } from "./ProfileCard.types";

export default function ProfileCard({
  name,
  email,
 studentId,
  career,
  avatar,
  onEdit,
}: ProfileCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <Avatar
          src={avatar}
          alt={name}
          size="lg"
        />

        <h2 className="text-xl font-semibold text-textPrimary">
          {name}
        </h2>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ProfileInfoItem
          label="Email"
          value={email}
        />

        <ProfileInfoItem
          label="Student ID"
          value={studentId}
        />

        <ProfileInfoItem
          label="Career"
          value={career}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onEdit}>
          Edit Profile
        </Button>
      </div>
    </div>
  );
}