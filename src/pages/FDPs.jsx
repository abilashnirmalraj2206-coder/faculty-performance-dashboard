import { useEffect, useState } from "react";
import { Plus, Trash2, X, Award, Pencil } from "lucide-react";
import { apiFetch } from "../api/api";

function FDPs() {
  const [fdps, setFdps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newFdp, setNewFdp] = useState({
    title: "",
    organization: "",
    duration: "",
    year: "",
  });

  // ==========================================
  // GET FDPS FROM MONGODB
  // ==========================================

  const fetchFdps = async () => {
    try {
      const response = await apiFetch("/api/fdps");

      if (!response.ok) {
        throw new Error("Failed to fetch FDPs");
      }

      const data = await response.json();

      setFdps(data);
    } catch (error) {
      console.error("Error fetching FDPs:", error);
    }
  };

  useEffect(() => {
    fetchFdps();
  }, []);

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setEditingId(null);

    setNewFdp({
      title: "",
      organization: "",
      duration: "",
      year: "",
    });

    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (fdp) => {
    setEditingId(fdp._id);

    setNewFdp({
      title: fdp.title,
      organization: fdp.organization,
      duration: fdp.duration,
      year: fdp.year,
    });

    setShowForm(true);
  };

  // ==========================================
  // ADD OR UPDATE FDP
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newFdp.title ||
      !newFdp.organization ||
      !newFdp.duration ||
      !newFdp.year
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      let response;

      // UPDATE FDP

      if (editingId) {
        response = await apiFetch(
          `/api/fdps/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(newFdp),
          }
        );
      }

      // ADD FDP

      else {
        response = await apiFetch(
          "/api/fdps",
          {
            method: "POST",
            body: JSON.stringify(newFdp),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to save FDP");
      }

      await fetchFdps();

      setNewFdp({
        title: "",
        organization: "",
        duration: "",
        year: "",
      });

      setEditingId(null);
      setShowForm(false);

    } catch (error) {
      console.error("Error saving FDP:", error);
      alert("Failed to save FDP");
    }
  };

  // ==========================================
  // DELETE FDP
  // ==========================================

  const deleteFdp = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this FDP?"
    );

    if (!confirmDelete) return;

    try {
      const response = await apiFetch(
        `/api/fdps/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete FDP");
      }

      await fetchFdps();

    } catch (error) {
      console.error("Error deleting FDP:", error);
      alert("Failed to delete FDP");
    }
  };

  return (
    <div>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            FDPs & Certifications
          </h1>

          <p className="text-neutral-500 mt-2">
            Track faculty development programs and professional certifications.
          </p>

        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-medium hover:scale-105 transition"
        >
          <Plus size={18} />
          Add FDP
        </button>

      </div>

      {/* SUMMARY */}

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <div className="flex items-center gap-4">

          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Award size={24} />
          </div>

          <div>

            <p className="text-sm text-neutral-400">
              Total Programs & Certifications
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {fdps.length}
            </h2>

          </div>

        </div>

      </div>

      {/* FDP CARDS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {fdps.map((fdp) => (

          <div
            key={fdp._id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  {fdp.title}
                </h2>

                <p className="text-blue-400 text-sm mt-2">
                  {fdp.organization}
                </p>

              </div>

              {/* ACTION BUTTONS */}

              <div className="flex items-center gap-2">

                <button
                  onClick={() => openEditForm(fdp)}
                  className="p-2 text-blue-400 rounded-lg hover:bg-blue-400/10"
                  title="Edit FDP"
                >
                  <Pencil size={20} />
                </button>

                <button
                  onClick={() => deleteFdp(fdp._id)}
                  className="p-2 text-red-400 rounded-lg hover:bg-red-400/10"
                  title="Delete FDP"
                >
                  <Trash2 size={20} />
                </button>

              </div>

            </div>

            <div className="mt-6 flex justify-between text-sm">

              <div>

                <p className="text-neutral-500">
                  Duration
                </p>

                <p className="mt-1">
                  {fdp.duration}
                </p>

              </div>

              <div>

                <p className="text-neutral-500">
                  Year
                </p>

                <p className="mt-1 font-semibold">
                  {fdp.year}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* ADD / EDIT FDP FORM */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] p-8"
          >

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="absolute right-5 top-5 text-neutral-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {editingId
                ? "Edit FDP / Certification"
                : "Add FDP / Certification"}
            </h2>

            <div className="space-y-5">

              {/* PROGRAM NAME */}

              <div>

                <label className="text-sm text-neutral-400">
                  Program / Certification Name
                </label>

                <input
                  type="text"
                  value={newFdp.title}
                  onChange={(e) =>
                    setNewFdp({
                      ...newFdp,
                      title: e.target.value,
                    })
                  }
                  placeholder="Example: Advanced Machine Learning"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>

              {/* ORGANIZATION */}

              <div>

                <label className="text-sm text-neutral-400">
                  Organization
                </label>

                <input
                  type="text"
                  value={newFdp.organization}
                  onChange={(e) =>
                    setNewFdp({
                      ...newFdp,
                      organization: e.target.value,
                    })
                  }
                  placeholder="Example: IIT Madras"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>

              {/* DURATION */}

              <div>

                <label className="text-sm text-neutral-400">
                  Duration
                </label>

                <input
                  type="text"
                  value={newFdp.duration}
                  onChange={(e) =>
                    setNewFdp({
                      ...newFdp,
                      duration: e.target.value,
                    })
                  }
                  placeholder="Example: 5 Days"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>

              {/* YEAR */}

              <div>

                <label className="text-sm text-neutral-400">
                  Year
                </label>

                <input
                  type="number"
                  value={newFdp.year}
                  onChange={(e) =>
                    setNewFdp({
                      ...newFdp,
                      year: e.target.value,
                    })
                  }
                  placeholder="2026"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>

              {/* SAVE BUTTON */}

              <button
                type="submit"
                className="w-full rounded-xl bg-white py-3 font-medium text-black hover:scale-[1.02] transition"
              >
                {editingId ? "Update FDP" : "Save FDP"}
              </button>

            </div>

          </form>

        </div>

      )}

    </div>
  );
}

export default FDPs;