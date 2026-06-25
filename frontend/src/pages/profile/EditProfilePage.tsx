import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

function EditProfilePage() {
  const navigate = useNavigate();

  const profile = JSON.parse(
    localStorage.getItem("profile") ||
      JSON.stringify({
        firstName: "Luis",
        lastName: "Paspuezan",
        email: "luis@uce.edu.ec",
        role: "Student",
      })
  );

  const [firstName, setFirstName] = useState(
    profile.firstName
  );

  const [lastName, setLastName] = useState(
    profile.lastName
  );

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    localStorage.setItem(
      "profile",
      JSON.stringify({
        ...profile,
        firstName,
        lastName,
      })
    );

    alert("Profile updated successfully.");

    navigate("/profile");
  };

  return (
    <DashboardLayout title="Edit Profile">
      <div className="rounded-lg bg-white p-6 shadow">

        <h2 className="mb-4 text-2xl font-bold">
          Edit Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            value={firstName}
            onChange={(e) =>
              setFirstName(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            value={lastName}
            onChange={(e) =>
              setLastName(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Save Changes
          </button>

        </form>

      </div>
    </DashboardLayout>
  );
}

export default EditProfilePage;