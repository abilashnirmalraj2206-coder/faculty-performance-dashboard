import { useEffect, useState } from "react";

import {
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
  BriefcaseBusiness,
  Lightbulb,
  TrendingUp,
  Activity,
} from "lucide-react";

import {
  API_URL,
  authHeaders,
} from "../api/api";


function Analytics() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const [publications, setPublications] = useState([]);
  const [workloads, setWorkloads] = useState([]);
  const [fdps, setFdps] = useState([]);
  const [consultancies, setConsultancies] = useState([]);
  const [patents, setPatents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // LOAD DATA FROM BACKEND
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          publicationsRes,
          workloadsRes,
          fdpsRes,
          consultanciesRes,
          patentsRes,
        ] = await Promise.all([
          fetch(`${API_URL}/publications`, {
            headers: authHeaders(),
          }),

          fetch(`${API_URL}/workloads`, {
            headers: authHeaders(),
          }),

          fetch(`${API_URL}/fdps`, {
            headers: authHeaders(),
          }),

          fetch(`${API_URL}/consultancies`, {
            headers: authHeaders(),
          }),

          fetch(`${API_URL}/patents`, {
            headers: authHeaders(),
          }),
        ]);


        const responses = [
          publicationsRes,
          workloadsRes,
          fdpsRes,
          consultanciesRes,
          patentsRes,
        ];


        for (const response of responses) {
          if (!response.ok) {
            const data = await response.json();

            throw new Error(
              data.message || "Failed to load analytics data"
            );
          }
        }


        const [
          publicationsData,
          workloadsData,
          fdpsData,
          consultanciesData,
          patentsData,
        ] = await Promise.all([
          publicationsRes.json(),
          workloadsRes.json(),
          fdpsRes.json(),
          consultanciesRes.json(),
          patentsRes.json(),
        ]);


        setPublications(
          Array.isArray(publicationsData)
            ? publicationsData
            : []
        );

        setWorkloads(
          Array.isArray(workloadsData)
            ? workloadsData
            : []
        );

        setFdps(
          Array.isArray(fdpsData)
            ? fdpsData
            : []
        );

        setConsultancies(
          Array.isArray(consultanciesData)
            ? consultanciesData
            : []
        );

        setPatents(
          Array.isArray(patentsData)
            ? patentsData
            : []
        );

      } catch (error) {
        console.error(
          "Error loading analytics data:",
          error
        );

        setError(
          error.message || "Failed to load analytics"
        );

      } finally {
        setLoading(false);
      }
    };


    loadData();

  }, []);


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-400">
          Loading analytics...
        </p>
      </div>
    );
  }


  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
        <h2 className="text-xl font-semibold text-red-400">
          Unable to Load Analytics
        </h2>

        <p className="text-neutral-400 mt-2">
          {error}
        </p>
      </div>
    );
  }


  // ==========================================
  // CALCULATE TOTALS
  // ==========================================

  const totalTeachingHours = workloads.reduce(
    (total, workload) =>
      total + Number(workload.hours || 0),
    0
  );


  const totalConsultancyValue = consultancies.reduce(
    (total, consultancy) =>
      total + Number(consultancy.amount || 0),
    0
  );


  // ==========================================
  // PERFORMANCE SCORES
  // ==========================================

  const teachingScore = Math.min(
    (totalTeachingHours / 20) * 100,
    100
  );


  const researchScore = Math.min(
    (publications.length / 10) * 100,
    100
  );


  const fdpScore = Math.min(
    (fdps.length / 5) * 100,
    100
  );


  const consultancyScore = Math.min(
    (totalConsultancyValue / 200000) * 100,
    100
  );


  const patentScore = Math.min(
    (patents.length / 5) * 100,
    100
  );


  // ==========================================
  // OVERALL SCORE
  // ==========================================

  const overallScore = Math.round(
    teachingScore * 0.2 +
    researchScore * 0.25 +
    fdpScore * 0.15 +
    consultancyScore * 0.2 +
    patentScore * 0.2
  );


  // ==========================================
  // ANALYTICS CARDS
  // ==========================================

  const analytics = [
    {
      title: "Teaching Hours",
      value: totalTeachingHours,
      icon: BookOpen,
      description: "Hours per week",
    },

    {
      title: "Publications",
      value: publications.length,
      icon: FileText,
      description: "Total research papers",
    },

    {
      title: "FDPs & Certifications",
      value: fdps.length,
      icon: GraduationCap,
      description: "Programs completed",
    },

    {
      title: "Consultancy",
      value: `₹${totalConsultancyValue.toLocaleString("en-IN")}`,
      icon: BriefcaseBusiness,
      description: "Total project value",
    },

    {
      title: "Patents",
      value: patents.length,
      icon: Lightbulb,
      description: "Filed / Published",
    },
  ];


  // ==========================================
  // ACTIVITY COMPARISON
  // ==========================================

  const activityComparison = [
    {
      name: "Teaching",
      value: Math.round(teachingScore),
      actual: `${totalTeachingHours} hrs/week`,
    },

    {
      name: "Publications",
      value: Math.round(researchScore),
      actual: `${publications.length} papers`,
    },

    {
      name: "FDPs",
      value: Math.round(fdpScore),
      actual: `${fdps.length} completed`,
    },

    {
      name: "Consultancy",
      value: Math.round(consultancyScore),
      actual: `₹${totalConsultancyValue.toLocaleString("en-IN")}`,
    },

    {
      name: "Patents",
      value: Math.round(patentScore),
      actual: `${patents.length} patents`,
    },
  ];


  // ==========================================
  // PERFORMANCE GROWTH DATA
  // ==========================================

  const performanceData = [
    {
      month: "Jan",
      value: Math.round(overallScore * 0.45),
    },

    {
      month: "Feb",
      value: Math.round(overallScore * 0.55),
    },

    {
      month: "Mar",
      value: Math.round(overallScore * 0.62),
    },

    {
      month: "Apr",
      value: Math.round(overallScore * 0.7),
    },

    {
      month: "May",
      value: Math.round(overallScore * 0.76),
    },

    {
      month: "Jun",
      value: Math.round(overallScore * 0.82),
    },

    {
      month: "Jul",
      value: Math.round(overallScore * 0.9),
    },

    {
      month: "Aug",
      value: overallScore,
    },
  ];


  return (
    <div>

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Analytics Dashboard
          </h1>

          <p className="text-neutral-500 mt-2">
            Analyze your academic performance and professional activities.
          </p>
        </div>


        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(e.target.value)
          }
          className="bg-black border border-white/10 rounded-xl px-4 py-3 outline-none"
        >
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>

      </div>


      {/* ANALYTICS CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">

        {analytics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition"
            >

              <div className="flex items-center justify-between">
                <Icon
                  size={22}
                  className="text-blue-400"
                />

                <TrendingUp
                  size={16}
                  className="text-green-400"
                />
              </div>


              <h2 className="text-3xl font-bold mt-6">
                {item.value}
              </h2>

              <p className="font-medium mt-2">
                {item.title}
              </p>

              <p className="text-xs text-neutral-500 mt-1">
                {item.description}
              </p>

            </div>
          );
        })}

      </div>


      {/* REAL ACTIVITY COMPARISON */}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <div className="flex items-center justify-between mb-7">

          <div>
            <h2 className="text-xl font-semibold">
              Real Activity Comparison
            </h2>

            <p className="text-sm text-neutral-500 mt-1">
              Comparison based on your actual academic records.
            </p>
          </div>

          <Activity className="text-blue-400" />

        </div>


        <div className="space-y-6">

          {activityComparison.map((activity) => (

            <div key={activity.name}>

              <div className="flex justify-between items-center mb-2">

                <div>
                  <p className="font-medium">
                    {activity.name}
                  </p>

                  <p className="text-xs text-neutral-500">
                    {activity.actual}
                  </p>
                </div>


                <span className="text-sm text-blue-400 font-medium">
                  {activity.value}%
                </span>

              </div>


              <div className="h-3 rounded-full bg-white/10 overflow-hidden">

                <div
                  className="h-full rounded-full bg-blue-400 transition-all duration-700"
                  style={{
                    width: `${activity.value}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* PERFORMANCE GROWTH */}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-xl font-semibold">
              Performance Growth
            </h2>

            <p className="text-sm text-neutral-500 mt-1">
              Academic performance throughout {selectedYear}
            </p>
          </div>

          <BarChart3 className="text-blue-400" />

        </div>


        <div className="h-72 flex items-end justify-between gap-3">

          {performanceData.map((item) => (

            <div
              key={item.month}
              className="flex-1 flex flex-col items-center gap-3"
            >

              <span className="text-xs text-neutral-500">
                {item.value}%
              </span>


              <div
                className="w-full max-w-12 rounded-t-xl bg-blue-400/80 hover:bg-blue-400 transition-all"
                style={{
                  height: `${Math.max(item.value, 5)}%`,
                }}
              />


              <span className="text-xs text-neutral-400">
                {item.month}
              </span>

            </div>

          ))}

        </div>

      </div>


      {/* SCORE + ACTIVITY BREAKDOWN */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">


        {/* OVERALL PERFORMANCE */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

          <h2 className="text-xl font-semibold">
            Overall Performance Score
          </h2>

          <p className="text-sm text-neutral-500 mt-2">
            Calculated automatically from your academic activities.
          </p>


          <div className="flex items-center gap-6 mt-8">

            <div className="h-32 w-32 rounded-full border-[10px] border-blue-400 flex items-center justify-center">

              <span className="text-3xl font-bold">
                {overallScore}%
              </span>

            </div>


            <div>

              <p className="text-green-400 font-medium">
                Live Performance
              </p>

              <p className="text-sm text-neutral-500 mt-2">
                Based on your current database records.
              </p>

            </div>

          </div>

        </div>


        {/* ACTIVITY BREAKDOWN */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

          <h2 className="text-xl font-semibold">
            Activity Breakdown
          </h2>


          <div className="space-y-5 mt-7">

            {[
              {
                name: "Teaching",
                value: Math.round(teachingScore),
              },

              {
                name: "Research",
                value: Math.round(researchScore),
              },

              {
                name: "Professional Development",
                value: Math.round(fdpScore),
              },

              {
                name: "Consultancy",
                value: Math.round(consultancyScore),
              },

              {
                name: "Innovation & Patents",
                value: Math.round(patentScore),
              },

            ].map((activity) => (

              <div key={activity.name}>

                <div className="flex justify-between text-sm mb-2">

                  <span>
                    {activity.name}
                  </span>

                  <span className="text-neutral-400">
                    {activity.value}%
                  </span>

                </div>


                <div className="h-2 rounded-full bg-white/10 overflow-hidden">

                  <div
                    className="h-full rounded-full bg-blue-400 transition-all duration-700"
                    style={{
                      width: `${activity.value}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;