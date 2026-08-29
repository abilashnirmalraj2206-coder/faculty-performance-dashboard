import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Briefcase,
  Award,
  Edit3,
  Save,
  X,
} from "lucide-react";

function FacultyProfile() {
  const initialProfile = {
    name: "Dr. Faculty Name",
    designation: "Assistant Professor",
    department: "Artificial Intelligence & Data Science",
    email: "faculty@example.com",
    phone: "+91 98765 43210",
    employeeId: "FAC2026001",
    qualification: "Ph.D. in Computer Science",
    experience: "8 Years",
    specialization: "Artificial Intelligence, Machine Learning",
  };

  const [profile, setProfile] = useState(initialProfile);
  const [tempProfile, setTempProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  // ==============================
  // START EDITING
  // ==============================

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTempProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // SAVE PROFILE
  // ==============================

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);

    alert("Profile updated successfully!");
  };

  // ==============================
  // CANCEL EDITING
  // ==============================

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  // ==============================
  // PROFILE FIELDS
  // ==============================

  const fields = [
    {
      label: "Full Name",
      name: "name",
      icon: User,
    },
    {
      label: "Designation",
      name: "designation",
      icon: Briefcase,
    },
    {
      label: "Department",
      name: "department",
      icon: Building2,
    },
    {
      label: "Email Address",
      name: "email",
      icon: Mail,
    },
    {
      label: "Phone Number",
      name: "phone",
      icon: Phone,
    },
    {
      label: "Employee ID",
      name: "employeeId",
      icon: Award,
    },
    {
      label: "Qualification",
      name: "qualification",
      icon: GraduationCap,
    },
    {
      label: "Experience",
      name: "experience",
      icon: Briefcase,
    },
    {
      label: "Specialization",
      name: "specialization",
      icon: Award,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Faculty Profile
          </h1>

          <p className="text-neutral-500 mt-2">
            Manage your professional and academic information.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center justify-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-medium hover:scale-105 transition"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">

            <button
              onClick={handleCancel}
              className="flex items-center gap-2 border border-white/10 px-5 py-3 rounded-xl hover:bg-white/5 transition"
            >
              <X size={18} />
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-medium hover:scale-105 transition"
            >
              <Save size={18} />
              Save Profile
            </button>

          </div>
        )}

      </div>


      {/* PROFILE HEADER */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 mb-6">

        <div className="flex flex-col md:flex-row md:items-center gap-6">

          {/* AVATAR */}

          <div className="h-28 w-28 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">

            <User
              size={52}
              className="text-blue-400"
            />

          </div>


          {/* BASIC INFO */}

          <div>

            <h2 className="text-3xl font-bold">
              {profile.name}
            </h2>

            <p className="text-blue-400 mt-2 font-medium">
              {profile.designation}
            </p>

            <p className="text-neutral-500 mt-1">
              {profile.department}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">

              <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400">
                Faculty
              </span>

              <span className="px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-400">
                Active
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* PROFILE DETAILS */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

        <div className="mb-7">

          <h2 className="text-xl font-semibold">
            Professional Information
          </h2>

          <p className="text-sm text-neutral-500 mt-1">
            Personal, academic, and professional details.
          </p>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {fields.map((field) => {

            const Icon = field.icon;

            return (

              <div
                key={field.name}
                className="rounded-xl border border-white/10 bg-black/20 p-5"
              >

                <div className="flex items-center gap-3 mb-3">

                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">

                    <Icon size={18} />

                  </div>

                  <p className="text-sm text-neutral-400">
                    {field.label}
                  </p>

                </div>


                {isEditing ? (

                  <input
                    type="text"
                    name={field.name}
                    value={tempProfile[field.name]}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-400"
                  />

                ) : (

                  <p className="font-medium text-lg break-words">
                    {profile[field.name]}
                  </p>

                )}

              </div>

            );

          })}

        </div>

      </div>


      {/* PROFILE SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <p className="text-sm text-neutral-500">
            Experience
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {profile.experience}
          </h3>

        </div>


        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <p className="text-sm text-neutral-500">
            Department
          </p>

          <h3 className="text-lg font-bold mt-2 break-words">
            {profile.department}
          </h3>

        </div>


        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <p className="text-sm text-neutral-500">
            Status
          </p>

          <h3 className="text-2xl font-bold mt-2 text-green-400">
            Active
          </h3>

        </div>

      </div>

    </div>
  );
}

export default FacultyProfile;