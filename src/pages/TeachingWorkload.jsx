import { useEffect, useState } from "react";
import { Plus, Trash2, X, Clock, Pencil } from "lucide-react";

function TeachingWorkload() {
  const [workloads, setWorkloads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newWorkload, setNewWorkload] = useState({
    subject: "",
    courseCode: "",
    semester: "",
    hours: "",
  });

  // ==========================================
  // GET WORKLOADS FROM MONGODB
  // ==========================================

  const fetchWorkloads = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/workloads"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch workloads");
      }

      const data = await response.json();

      setWorkloads(data);
    } catch (error) {
      console.error("Error fetching workloads:", error);
    }
  };

  useEffect(() => {
    fetchWorkloads();
  }, []);

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setEditingId(null);

    setNewWorkload({
      subject: "",
      courseCode: "",
      semester: "",
      hours: "",
    });

    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (workload) => {
    setEditingId(workload._id);

    setNewWorkload({
      subject: workload.subject,
      courseCode: workload.courseCode,
      semester: workload.semester,
      hours: workload.hours,
    });

    setShowForm(true);
  };

  // ==========================================
  // ADD OR UPDATE WORKLOAD
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newWorkload.subject ||
      !newWorkload.courseCode ||
      !newWorkload.semester ||
      !newWorkload.hours
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      let response;

      if (editingId) {
        // UPDATE WORKLOAD

        response = await fetch(
          `http://localhost:5000/api/workloads/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newWorkload),
          }
        );
      } else {
        // ADD WORKLOAD

        response = await fetch(
          "http://localhost:5000/api/workloads",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newWorkload),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to save workload");
      }

      await fetchWorkloads();

      setNewWorkload({
        subject: "",
        courseCode: "",
        semester: "",
        hours: "",
      });

      setEditingId(null);
      setShowForm(false);

    } catch (error) {
      console.error("Error saving workload:", error);
      alert("Failed to save workload");
    }
  };

  // ==========================================
  // DELETE WORKLOAD
  // ==========================================

  const deleteWorkload = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workload?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/workloads/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete workload");
      }

      await fetchWorkloads();

    } catch (error) {
      console.error("Error deleting workload:", error);
      alert("Failed to delete workload");
    }
  };

  // ==========================================
  // CALCULATE TOTAL HOURS
  // ==========================================

  const totalHours = workloads.reduce(
    (total, workload) =>
      total + Number(workload.hours || 0),
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
            Teaching Workload
          </h1>

          <p className="text-neutral-500 mt-2">
            Manage subjects, courses, semesters, and teaching hours.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-medium hover:scale-105 transition"
        >
          <Plus size={18} />
          Add Workload
        </button>

      </div>


      {/* TOTAL HOURS */}

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <div className="flex items-center gap-4">

          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Clock size={24} />
          </div>

          <div>

            <p className="text-sm text-neutral-400">
              Total Teaching Hours
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {totalHours} hrs/week
            </h2>

          </div>

        </div>

      </div>


      {/* WORKLOAD CARDS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {workloads.map((workload) => (

          <div
            key={workload._id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  {workload.subject}
                </h2>

                <p className="text-blue-400 text-sm mt-2">
                  {workload.courseCode}
                </p>

              </div>


              {/* EDIT + DELETE */}

              <div className="flex items-center gap-2">

                <button
                  onClick={() => openEditForm(workload)}
                  className="p-2 text-blue-400 rounded-lg hover:bg-blue-400/10"
                  title="Edit Workload"
                >
                  <Pencil size={19} />
                </button>

                <button
                  onClick={() =>
                    deleteWorkload(workload._id)
                  }
                  className="p-2 text-red-400 rounded-lg hover:bg-red-400/10"
                  title="Delete Workload"
                >
                  <Trash2 size={19} />
                </button>

              </div>

            </div>


            <div className="mt-6 flex justify-between text-sm">

              <div>

                <p className="text-neutral-500">
                  Semester
                </p>

                <p className="mt-1">
                  {workload.semester}
                </p>

              </div>


              <div>

                <p className="text-neutral-500">
                  Weekly Hours
                </p>

                <p className="mt-1 font-semibold">
                  {workload.hours} hrs
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* EMPTY STATE */}

      {workloads.length === 0 && (

        <div className="mt-8 text-center text-neutral-500">

          <p>No teaching workloads added yet.</p>

        </div>

      )}


      {/* ADD / EDIT WORKLOAD FORM */}

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
                ? "Edit Teaching Workload"
                : "Add Teaching Workload"}

            </h2>


            <div className="space-y-5">


              {/* SUBJECT */}

              <div>

                <label className="text-sm text-neutral-400">
                  Subject Name
                </label>

                <input
                  type="text"
                  value={newWorkload.subject}
                  onChange={(e) =>
                    setNewWorkload({
                      ...newWorkload,
                      subject: e.target.value,
                    })
                  }
                  placeholder="Example: Data Structures"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>


              {/* COURSE CODE */}

              <div>

                <label className="text-sm text-neutral-400">
                  Course Code
                </label>

                <input
                  type="text"
                  value={newWorkload.courseCode}
                  onChange={(e) =>
                    setNewWorkload({
                      ...newWorkload,
                      courseCode: e.target.value,
                    })
                  }
                  placeholder="Example: CS301"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>


              {/* SEMESTER */}

              <div>

                <label className="text-sm text-neutral-400">
                  Semester
                </label>

                <input
                  type="text"
                  value={newWorkload.semester}
                  onChange={(e) =>
                    setNewWorkload({
                      ...newWorkload,
                      semester: e.target.value,
                    })
                  }
                  placeholder="Example: Semester 3"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>


              {/* HOURS */}

              <div>

                <label className="text-sm text-neutral-400">
                  Weekly Teaching Hours
                </label>

                <input
                  type="number"
                  min="1"
                  value={newWorkload.hours}
                  onChange={(e) =>
                    setNewWorkload({
                      ...newWorkload,
                      hours: e.target.value,
                    })
                  }
                  placeholder="Example: 6"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-blue-400"
                />

              </div>


              {/* SAVE BUTTON */}

              <button
                type="submit"
                className="w-full rounded-xl bg-white py-3 font-medium text-black hover:scale-[1.02] transition"
              >

                {editingId
                  ? "Update Workload"
                  : "Save Workload"}

              </button>

            </div>

          </form>

        </div>

      )}

    </div>
  );
}

export default TeachingWorkload;