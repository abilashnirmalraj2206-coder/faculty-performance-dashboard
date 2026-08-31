import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  BriefcaseBusiness,
  IndianRupee,
  Pencil,
} from "lucide-react";

import { apiFetch } from "../api/api";

function Consultancy() {
  const [consultancies, setConsultancies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newConsultancy, setNewConsultancy] = useState({
    title: "",
    client: "",
    amount: "",
    status: "Ongoing",
  });

  // ==========================================
  // FETCH CONSULTANCIES
  // ==========================================

  const fetchConsultancies = async () => {
    try {
      setLoading(true);

      const response = await apiFetch("/api/consultancies");

      if (!response.ok) {
        throw new Error("Failed to fetch consultancies");
      }

      const data = await response.json();

      setConsultancies(data);

    } catch (error) {
      console.error(
        "Error fetching consultancies:",
        error
      );

      alert("Failed to fetch consultancy data");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultancies();
  }, []);

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setEditingId(null);

    setNewConsultancy({
      title: "",
      client: "",
      amount: "",
      status: "Ongoing",
    });

    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (consultancy) => {
    setEditingId(consultancy._id);

    setNewConsultancy({
      title: consultancy.title || "",
      client: consultancy.client || "",
      amount: consultancy.amount || "",
      status: consultancy.status || "Ongoing",
    });

    setShowForm(true);
  };

  // ==========================================
  // ADD OR UPDATE CONSULTANCY
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newConsultancy.title.trim() ||
      !newConsultancy.client.trim() ||
      !newConsultancy.amount
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      let response;

      // UPDATE CONSULTANCY

      if (editingId) {
        response = await apiFetch(
          `/api/consultancies/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(newConsultancy),
          }
        );
      }

      // ADD CONSULTANCY

      else {
        response = await apiFetch(
          "/api/consultancies",
          {
            method: "POST",
            body: JSON.stringify(newConsultancy),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.message ||
          "Failed to save consultancy"
        );
      }

      await fetchConsultancies();

      setNewConsultancy({
        title: "",
        client: "",
        amount: "",
        status: "Ongoing",
      });

      setEditingId(null);
      setShowForm(false);

      alert(
        editingId
          ? "Consultancy updated successfully!"
          : "Consultancy added successfully!"
      );

    } catch (error) {
      console.error(
        "Error saving consultancy:",
        error
      );

      alert(
        error.message ||
        "Failed to save consultancy"
      );
    }
  };

  // ==========================================
  // DELETE CONSULTANCY
  // ==========================================

  const deleteConsultancy = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this consultancy?"
    );

    if (!confirmed) return;

    try {
      const response = await apiFetch(
        `/api/consultancies/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.message ||
          "Failed to delete consultancy"
        );
      }

      await fetchConsultancies();

      alert("Consultancy deleted successfully!");

    } catch (error) {
      console.error(
        "Error deleting consultancy:",
        error
      );

      alert(
        error.message ||
        "Failed to delete consultancy"
      );
    }
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);

    setNewConsultancy({
      title: "",
      client: "",
      amount: "",
      status: "Ongoing",
    });
  };

  // ==========================================
  // CALCULATE TOTAL AMOUNT
  // ==========================================

  const totalAmount = consultancies.reduce(
    (total, consultancy) =>
      total + Number(consultancy.amount || 0),
    0
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Consultancy
          </h1>

          <p className="text-neutral-500 mt-2">
            Manage consultancy projects and professional engagements.
          </p>

        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-medium hover:scale-105 transition"
        >
          <Plus size={18} />
          Add Consultancy
        </button>

      </div>


      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex items-center gap-4">

            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <BriefcaseBusiness size={24} />
            </div>

            <div>

              <p className="text-sm text-neutral-400">
                Total Consultancy Projects
              </p>

              <h2 className="text-3xl font-bold mt-1">
                {consultancies.length}
              </h2>

            </div>

          </div>

        </div>


        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex items-center gap-4">

            <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
              <IndianRupee size={24} />
            </div>

            <div>

              <p className="text-sm text-neutral-400">
                Total Consultancy Value
              </p>

              <h2 className="text-3xl font-bold mt-1">
                ₹{totalAmount.toLocaleString("en-IN")}
              </h2>

            </div>

          </div>

        </div>

      </div>


      {/* LOADING */}

      {loading && (

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">

          <p className="text-neutral-400">
            Loading consultancy data...
          </p>

        </div>

      )}


      {/* EMPTY STATE */}

      {!loading && consultancies.length === 0 && (

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">

          <BriefcaseBusiness
            size={40}
            className="mx-auto text-neutral-500"
          />

          <h2 className="text-xl font-semibold mt-4">
            No Consultancy Projects Yet
          </h2>

          <p className="text-neutral-500 mt-2">
            Add your first consultancy project to get started.
          </p>

        </div>

      )}


      {/* CONSULTANCY CARDS */}

      {!loading && consultancies.length > 0 && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {consultancies.map((consultancy) => (

            <div
              key={consultancy._id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition"
            >

              <div className="flex items-start justify-between">

                <div className="pr-4">

                  <h2 className="text-xl font-semibold">
                    {consultancy.title}
                  </h2>

                  <p className="text-blue-400 text-sm mt-2">
                    {consultancy.client}
                  </p>

                </div>


                {/* ACTION BUTTONS */}

                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      openEditForm(consultancy)
                    }
                    className="p-2 text-blue-400 rounded-lg hover:bg-blue-400/10 transition"
                    title="Edit Consultancy"
                  >
                    <Pencil size={19} />
                  </button>


                  <button
                    onClick={() =>
                      deleteConsultancy(consultancy._id)
                    }
                    className="p-2 text-red-400 rounded-lg hover:bg-red-400/10 transition"
                    title="Delete Consultancy"
                  >
                    <Trash2 size={19} />
                  </button>

                </div>

              </div>


              {/* DETAILS */}

              <div className="mt-6 flex justify-between items-center text-sm">

                <div>

                  <p className="text-neutral-500">
                    Project Value
                  </p>

                  <p className="mt-1 font-semibold">

                    ₹
                    {Number(
                      consultancy.amount
                    ).toLocaleString("en-IN")}

                  </p>

                </div>


                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    consultancy.status === "Completed"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {consultancy.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* ADD / EDIT FORM */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] p-8"
          >

            <button
              type="button"
              onClick={closeForm}
              className="absolute right-5 top-5 text-neutral-400 hover:text-white transition"
            >
              <X size={20} />
            </button>


            <h2 className="text-2xl font-bold mb-6">

              {editingId
                ? "Edit Consultancy Project"
                : "Add Consultancy Project"}

            </h2>


            <div className="space-y-5">


              {/* PROJECT TITLE */}

              <div>

                <label className="text-sm text-neutral-400">
                  Project Title
                </label>

                <input
                  type="text"
                  value={newConsultancy.title}
                  onChange={(e) =>
                    setNewConsultancy({
                      ...newConsultancy,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter project title"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>


              {/* CLIENT */}

              <div>

                <label className="text-sm text-neutral-400">
                  Client / Organization
                </label>

                <input
                  type="text"
                  value={newConsultancy.client}
                  onChange={(e) =>
                    setNewConsultancy({
                      ...newConsultancy,
                      client: e.target.value,
                    })
                  }
                  placeholder="Enter client name"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>


              {/* AMOUNT */}

              <div>

                <label className="text-sm text-neutral-400">
                  Project Value (₹)
                </label>

                <input
                  type="number"
                  min="1"
                  value={newConsultancy.amount}
                  onChange={(e) =>
                    setNewConsultancy({
                      ...newConsultancy,
                      amount: e.target.value,
                    })
                  }
                  placeholder="Example: 50000"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>


              {/* STATUS */}

              <div>

                <label className="text-sm text-neutral-400">
                  Status
                </label>

                <select
                  value={newConsultancy.status}
                  onChange={(e) =>
                    setNewConsultancy({
                      ...newConsultancy,
                      status: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                >

                  <option value="Ongoing">
                    Ongoing
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

              </div>


              {/* SAVE BUTTON */}

              <button
                type="submit"
                className="w-full rounded-xl bg-white py-3 font-medium text-black hover:scale-[1.02] transition"
              >

                {editingId
                  ? "Update Consultancy"
                  : "Save Consultancy"}

              </button>

            </div>

          </form>

        </div>

      )}

    </div>
  );
}

export default Consultancy;