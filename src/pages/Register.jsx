import { useState } from "react";
import { UserPlus, Eye, EyeOff } from "lucide-react";

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      alert("Please fill in Name, Email and Password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Please login.");

      onLogin();

    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">

        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400">
            <UserPlus size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-neutral-400 text-center mt-2">
          Create your Faculty Performance Dashboard account
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-8"
        >
          <div>
            <label className="text-sm text-neutral-400">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">
              Password
            </label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 pr-12 outline-none focus:border-blue-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-neutral-400">
              Department
            </label>

            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Example: AI & Data Science"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">
              Designation
            </label>

            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Example: Assistant Professor"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-semibold text-black hover:scale-[1.02] transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-neutral-400 text-sm mt-6">
          Already have an account?{" "}

          <button
            onClick={onLogin}
            className="text-blue-400 hover:text-blue-300"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;