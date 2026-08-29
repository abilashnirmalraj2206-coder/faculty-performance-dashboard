import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  X,
  FileText,
  Pencil,
} from "lucide-react";

import { apiFetch } from "../api/api";

function Publications() {
  const [publications, setPublications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newPublication, setNewPublication] = useState({
    title: "",
    journal: "",
    year: "",
  });

  // ==========================================
  // FETCH PUBLICATIONS
  // ==========================================

  const fetchPublications = async () => {
    try {
      setLoading(true);

      const response = await apiFetch("/publications");

      if (!response.ok) {
        throw new Error("Failed to fetch publications");
      }

      const data = await response.json();

      setPublications(data);

    } catch (error) {
      console.error(
        "Error fetching publications:",
        error
      );

      alert("Failed to fetch publications");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setEditingId(null);

    setNewPublication({
      title: "",
      journal: "",
      year: "",
    });

    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (publication) => {
    setEditingId(publication._id);

    setNewPublication({
      title: publication.title || "",
      journal: publication.journal || "",
      year: publication.year || "",
    });

    setShowForm(true);
  };

  // ==========================================
  // ADD OR UPDATE PUBLICATION
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newPublication.title.trim() ||
      !newPublication.journal.trim() ||
      !newPublication.year
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      let response;

      // UPDATE PUBLICATION

      if (editingId) {
        response = await apiFetch(
          `/publications/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(newPublication),
          }
        );
      }

      // ADD PUBLICATION

      else {
        response = await apiFetch(
          "/publications",
          {
            method: "POST",
            body: JSON.stringify(newPublication),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.message ||
          "Failed to save publication"
        );
      }

      await fetchPublications();

      setNewPublication({
        title: "",
        journal: "",
        year: "",
      });

      setEditingId(null);
      setShowForm(false);

      alert(
        editingId
          ? "Publication updated successfully!"
          : "Publication added successfully!"
      );

    } catch (error) {
      console.error(
        "Error saving publication:",
        error
      );

      alert(
        error.message ||
        "Failed to save publication"
      );
    }
  };

  // ==========================================
  // DELETE PUBLICATION
  // ==========================================

  const deletePublication = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this publication?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiFetch(
        `/publications/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.message ||
          "Failed to delete publication"
        );
      }

      await fetchPublications();

      alert("Publication deleted successfully!");

    } catch (error) {
      console.error(
        "Error deleting publication:",
        error
      );

      alert(
        error.message ||
        "Failed to delete publication"
      );
    }
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);

    setNewPublication({
      title: "",
      journal: "",
      year: "",
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Publications
          </h1>

          <p className="text-neutral-500 mt-2">
            Manage research papers and academic publications.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-medium hover:scale-105 transition"
        >
          <Plus size={18} />
          Add Publication
        </button>

      </div>


      {/* SUMMARY */}

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <div className="flex items-center gap-4">

          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <FileText size={24} />
          </div>

          <div>

            <p className="text-sm text-neutral-400">
              Total Publications
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {publications.length}
            </h2>

          </div>

        </div>

      </div>


      {/* LOADING */}

      {loading && (

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">

          <p className="text-neutral-400">
            Loading publications...
          </p>

        </div>

      )}


      {/* EMPTY STATE */}

      {!loading && publications.length === 0 && (

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">

          <FileText
            size={40}
            className="mx-auto text-neutral-500"
          />

          <h2 className="text-xl font-semibold mt-4">
            No Publications Yet
          </h2>

          <p className="text-neutral-500 mt-2">
            Add your first research publication to get started.
          </p>

        </div>

      )}


      {/* PUBLICATION CARDS */}

      {!loading && publications.length > 0 && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {publications.map((publication) => (

            <div
              key={publication._id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition"
            >

              <div className="flex items-start justify-between">

                <div className="pr-4">

                  <h2 className="text-xl font-semibold">
                    {publication.title}
                  </h2>

                  <p className="text-blue-400 text-sm mt-2">
                    {publication.journal}
                  </p>

                </div>


                {/* ACTION BUTTONS */}

                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      openEditForm(publication)
                    }
                    className="p-2 text-blue-400 rounded-lg hover:bg-blue-400/10 transition"
                    title="Edit Publication"
                  >
                    <Pencil size={19} />
                  </button>

                  <button
                    onClick={() =>
                      deletePublication(publication._id)
                    }
                    className="p-2 text-red-400 rounded-lg hover:bg-red-400/10 transition"
                    title="Delete Publication"
                  >
                    <Trash2 size={19} />
                  </button>

                </div>

              </div>


              {/* YEAR */}

              <div className="mt-6">

                <p className="text-sm text-neutral-500">
                  Publication Year
                </p>

                <p className="mt-1 font-semibold">
                  {publication.year}
                </p>

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

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={closeForm}
              className="absolute right-5 top-5 text-neutral-400 hover:text-white transition"
            >
              <X size={20} />
            </button>


            {/* FORM TITLE */}

            <h2 className="text-2xl font-bold mb-6">

              {editingId
                ? "Edit Publication"
                : "Add Publication"}

            </h2>


            <div className="space-y-5">


              {/* TITLE */}

              <div>

                <label className="text-sm text-neutral-400">
                  Publication Title
                </label>

                <input
                  type="text"
                  value={newPublication.title}
                  onChange={(e) =>
                    setNewPublication({
                      ...newPublication,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter publication title"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>


              {/* JOURNAL */}

              <div>

                <label className="text-sm text-neutral-400">
                  Journal
                </label>

                <input
                  type="text"
                  value={newPublication.journal}
                  onChange={(e) =>
                    setNewPublication({
                      ...newPublication,
                      journal: e.target.value,
                    })
                  }
                  placeholder="Enter journal name"
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
                  value={newPublication.year}
                  onChange={(e) =>
                    setNewPublication({
                      ...newPublication,
                      year: e.target.value,
                    })
                  }
                  placeholder="2026"
                  min="1900"
                  max="2100"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>


              {/* SAVE */}

              <button
                type="submit"
                className="w-full rounded-xl bg-white py-3 font-medium text-black hover:scale-[1.02] transition"
              >

                {editingId
                  ? "Update Publication"
                  : "Save Publication"}

              </button>

            </div>

          </form>

        </div>

      )}

    </div>
  );
}

export default Publications;