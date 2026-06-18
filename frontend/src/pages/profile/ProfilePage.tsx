import { Link } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

function ProfilePage() {
  const profile = JSON.parse(
    localStorage.getItem("profile") ||
      JSON.stringify({
        firstName: "Luis",
        lastName: "Paspuezan",
        email: "luis@uce.edu.ec",
        role: "Student",
      })
  );

  return (
    <DashboardLayout title="Profile">
      <div className="rounded-lg bg-white p-6 shadow">

        <h2 className="text-2xl font-bold">
          Profile Information
        </h2>

        <div className="mt-4 space-y-3">

          <p>
            <strong>First Name:</strong>{" "}
            {profile.firstName}
          </p>

          <p>
            <strong>Last Name:</strong>{" "}
            {profile.lastName}
          </p>

          <p>
            <strong>Institutional Email:</strong>{" "}
            {profile.email}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {profile.role}
          </p>

        </div>

        <Link
          to="/profile/edit"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Edit Profile
        </Link>

      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;