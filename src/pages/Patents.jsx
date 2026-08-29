import { useEffect, useState } from "react";
import { Plus, Trash2, X, Lightbulb } from "lucide-react";
import { API_URL, authHeaders } from "../api/api";

function Patents() {
  const [patents, setPatents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newPatent, setNewPatent] = useState({
    title: "",
    applicationNumber: "",
    status: "Filed",
    year: "",
  });

  // ==============================
  // GET PATENTS
  // ==============================

  const fetchPatents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/patents`, {
        headers: authHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch patents");
      }

      setPatents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching patents:", error);

      setError(
        error.message ||
          "Unable to connect to backend server"
      );

      setPatents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatents();
  }, []);

  // ==============================
  // ADD PATENT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newPatent.title.trim() ||
      !newPatent.applicationNumber.trim() ||
      !newPatent.status ||
      !newPatent.year
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/patents`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: newPatent.title.trim(),
          applicationNumber:
            newPatent.applicationNumber.trim(),
          status: newPatent.status,
          year: newPatent.year,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Error adding patent"
        );
      }

      setPatents((prev) => [...prev, data]);

      setNewPatent({
        title: "",
        applicationNumber: "",
        status: "Filed",
        year: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error adding patent:", error);

      alert(
        error.message ||
          "Unable to add patent"
      );
    }
  };

  // ==============================
  // DELETE PATENT
  // ==============================

  const deletePatent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patent?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/patents/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Error deleting patent"
        );
      }

      setPatents((prev) =>
        prev.filter(
          (patent) => patent._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Error deleting patent:",
        error
      );

      alert(
        error.message ||
          "Failed to delete patent"
      );
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-400">
          Loading patents...
        </p>
      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
        <h2 className="text-xl font-semibold text-red-400">
          Unable to Load Patents
        </h2>

        <p className="text-neutral-400 mt-2">
          {error}
        </p>

        <button
          onClick={fetchPatents}
          className="mt-4 rounded-xl bg-white px-5 py-2 text-black font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Patents
          </h1>

          <p className="text-neutral-500 mt-2">
            Manage patents, applications, and innovation records.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-medium hover:scale-105 transition"
        >
          <Plus size={18} />
          Add Patent
        </button>

      </div>


      {/* SUMMARY */}

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <div className="flex items-center gap-4">

          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Lightbulb size={24} />
          </div>

          <div>
            <p className="text-sm text-neutral-400">
              Total Patents
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {patents.length}
            </h2>
          </div>

        </div>

      </div>


      {/* PATENT CARDS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {patents.map((patent) => (

          <div
            key={patent._id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >

            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  {patent.title}
                </h2>

                <p className="text-blue-400 text-sm mt-2">
                  Application No: {patent.applicationNumber}
                </p>
              </div>

              <button
                onClick={() =>
                  deletePatent(patent._id)
                }
                className="p-2 text-red-400 rounded-lg hover:bg-red-400/10"
              >
                <Trash2 size={20} />
              </button>

            </div>


            <div className="mt-6 flex justify-between items-center text-sm">

              <div>
                <p className="text-neutral-500">
                  Year
                </p>

                <p className="mt-1 font-semibold">
                  {patent.year}
                </p>
              </div>


              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  patent.status === "Granted"
                    ? "bg-green-500/10 text-green-400"
                    : patent.status === "Published"
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-yellow-500/10 text-yellow-400"
                }`}
              >
                {patent.status}
              </span>

            </div>

          </div>

        ))}

      </div>


      {/* EMPTY STATE */}

      {patents.length === 0 && (

        <div className="mt-8 text-center text-neutral-500">
          No patents added yet.
        </div>

      )}


      {/* ADD PATENT FORM */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] p-8"
          >

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute right-5 top-5 text-neutral-400 hover:text-white"
            >
              <X size={20} />
            </button>


            <h2 className="text-2xl font-bold mb-6">
              Add Patent
            </h2>


            <div className="space-y-5">

              {/* PATENT TITLE */}

              <div>
                <label className="text-sm text-neutral-400">
                  Patent Title
                </label>

                <input
                  type="text"
                  value={newPatent.title}
                  onChange={(e) =>
                    setNewPatent({
                      ...newPatent,
                      title: e.target.value,
                    })
                  }
                  placeholder="Example: AI Student Analytics"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />
              </div>


              {/* APPLICATION NUMBER */}

              <div>
                <label className="text-sm text-neutral-400">
                  Application Number
                </label>

                <input
                  type="text"
                  value={newPatent.applicationNumber}
                  onChange={(e) =>
                    setNewPatent({
                      ...newPatent,
                      applicationNumber: e.target.value,
                    })
                  }
                  placeholder="Example: IN2026123456"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />
              </div>


              {/* STATUS */}

              <div>
                <label className="text-sm text-neutral-400">
                  Status
                </label>

                <select
                  value={newPatent.status}
                  onChange={(e) =>
                    setNewPatent({
                      ...newPatent,
                      status: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                >
                  <option value="Filed">
                    Filed
                  </option>

                  <option value="Published">
                    Published
                  </option>

                  <option value="Granted">
                    Granted
                  </option>
                </select>
              </div>


              {/* YEAR */}

              <div>
                <label className="text-sm text-neutral-400">
                  Year
                </label>

                <input
                  type="number"
                  value={newPatent.year}
                  onChange={(e) =>
                    setNewPatent({
                      ...newPatent,
                      year: e.target.value,
                    })
                  }
                  placeholder="2026"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />
              </div>


              {/* SAVE */}

              <button
                type="submit"
                className="w-full rounded-xl bg-white py-3 font-medium text-black hover:scale-[1.02] transition"
              >
                Save Patent
              </button>

            </div>

          </form>

        </div>

      )}

    </div>
  );
}

export default Patents;