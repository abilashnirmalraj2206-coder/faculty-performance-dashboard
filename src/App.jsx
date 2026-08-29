import { useEffect, useState } from "react";

import Publications from "./pages/Publications";
import TeachingWorkload from "./pages/TeachingWorkload";
import FDPs from "./pages/FDPs";
import Consultancy from "./pages/Consultancy";
import Patents from "./pages/Patents";
import Analytics from "./pages/Analytics";
import FacultyProfile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";

import { apiFetch } from "./api/api";

import {
  LayoutDashboard,
  User,
  BookOpen,
  FileText,
  GraduationCap,
  BriefcaseBusiness,
  Lightbulb,
  BarChart3,
  Bell,
  Search,
  Plus,
  LogOut,
} from "lucide-react";

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [authPage, setAuthPage] = useState("login");

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ==============================
  // DASHBOARD DATA
  // ==============================

  const [dashboardData, setDashboardData] = useState({
    workloads: [],
    publications: [],
    fdps: [],
    consultancies: [],
    patents: [],
  });

  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // ==============================
  // FETCH DASHBOARD DATA
  // ==============================

  const fetchDashboardData = async () => {
    try {
      setLoadingDashboard(true);

      const [
        workloadsResponse,
        publicationsResponse,
        fdpsResponse,
        consultanciesResponse,
        patentsResponse,
      ] = await Promise.all([
        apiFetch("/workloads"),
        apiFetch("/publications"),
        apiFetch("/fdps"),
        apiFetch("/consultancies"),
        apiFetch("/patents"),
      ]);

      const [
        workloads,
        publications,
        fdps,
        consultancies,
        patents,
      ] = await Promise.all([
        workloadsResponse.json(),
        publicationsResponse.json(),
        fdpsResponse.json(),
        consultanciesResponse.json(),
        patentsResponse.json(),
      ]);

      setDashboardData({
        workloads: Array.isArray(workloads) ? workloads : [],
        publications: Array.isArray(publications)
          ? publications
          : [],
        fdps: Array.isArray(fdps) ? fdps : [],
        consultancies: Array.isArray(consultancies)
          ? consultancies
          : [],
        patents: Array.isArray(patents)
          ? patents
          : [],
      });

    } catch (error) {
      console.error(
        "Error fetching dashboard data:",
        error
      );
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentUser(null);
    setAuthPage("login");
  };

  // ==============================
  // SIDEBAR MENU
  // ==============================

  const menuItems = [
    {
      name: "Overview",
      icon: LayoutDashboard,
    },
    {
      name: "Faculty Profile",
      icon: User,
    },
    {
      name: "Teaching Workload",
      icon: BookOpen,
    },
    {
      name: "Publications",
      icon: FileText,
    },
    {
      name: "FDPs & Certifications",
      icon: GraduationCap,
    },
    {
      name: "Consultancy",
      icon: BriefcaseBusiness,
    },
    {
      name: "Patents",
      icon: Lightbulb,
    },
    {
      name: "Analytics",
      icon: BarChart3,
    },
  ];

  // ==============================
  // AUTHENTICATION
  // ==============================

  if (!currentUser) {
    if (authPage === "register") {
      return (
        <Register
          onLogin={() => setAuthPage("login")}
        />
      );
    }

    return (
      <Login
        onLogin={(user) => setCurrentUser(user)}
        onRegister={() => setAuthPage("register")}
      />
    );
  }

  // ==============================
  // CALCULATIONS
  // ==============================

  const totalTeachingHours =
    dashboardData.workloads.reduce(
      (total, workload) =>
        total +
        (Number.parseFloat(workload.hours) || 0),
      0
    );

  const totalActivities =
    dashboardData.workloads.length +
    dashboardData.publications.length +
    dashboardData.fdps.length +
    dashboardData.consultancies.length +
    dashboardData.patents.length;

  const performanceScore = Math.min(
    100,
    Math.round(
      dashboardData.publications.length * 10 +
        dashboardData.fdps.length * 8 +
        dashboardData.consultancies.length * 12 +
        dashboardData.patents.length * 15 +
        totalTeachingHours * 2
    )
  );

  // ==============================
  // OVERVIEW STATS
  // ==============================

  const stats = [
    {
      title: "Teaching Workload",
      value: `${totalTeachingHours} hrs`,
      change: `${dashboardData.workloads.length} subjects added`,
    },
    {
      title: "Publications",
      value: dashboardData.publications.length,
      change: "Research contributions",
    },
    {
      title: "FDPs Completed",
      value: dashboardData.fdps.length,
      change: "Professional development",
    },
    {
      title: "Performance Score",
      value: `${performanceScore}%`,
      change: `${totalActivities} total activities`,
    },
  ];

  // ==============================
  // RECENT ACTIVITIES
  // ==============================

  const recentActivities = [
    ...dashboardData.publications.map((item) => ({
      title: "Research Publication",
      description: item.title,
      date: item.createdAt,
    })),

    ...dashboardData.fdps.map((item) => ({
      title: "Faculty Development Program",
      description: item.title,
      date: item.createdAt,
    })),

    ...dashboardData.workloads.map((item) => ({
      title: "Teaching Activity",
      description: `${item.subject} - ${item.courseCode}`,
      date: item.createdAt,
    })),

    ...dashboardData.consultancies.map((item) => ({
      title: "Consultancy",
      description: item.title,
      date: item.createdAt,
    })),

    ...dashboardData.patents.map((item) => ({
      title: "Patent",
      description: item.title,
      date: item.createdAt,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    )
    .slice(0, 5);

  // ==============================
  // ACTIVITY BAR VALUES
  // ==============================

  const chartData = [
    dashboardData.workloads.length,
    dashboardData.publications.length,
    dashboardData.fdps.length,
    dashboardData.consultancies.length,
    dashboardData.patents.length,
  ];

  const maxChartValue = Math.max(
    ...chartData,
    1
  );

  const chartLabels = [
    "Workload",
    "Publications",
    "FDPs",
    "Consultancy",
    "Patents",
  ];

  // ==============================
  // DATE FORMAT
  // ==============================

  const formatDate = (date) => {
    if (!date) return "Recently";

    const activityDate = new Date(date);
    const today = new Date();

    const difference =
      today - activityDate;

    const days =
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );

    if (days === 0) {
      return "Today";
    }

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    if (days < 30) {
      return `${Math.floor(days / 7)} weeks ago`;
    }

    return activityDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-72 min-h-screen border-r border-white/10 bg-black/40 p-6 hidden md:flex flex-col">

        {/* LOGO */}

        <div className="text-2xl font-bold mb-12">
          Faculty
          <span className="text-blue-400">
            Insight
          </span>
        </div>

        {/* MENU */}

        <div className="space-y-2 flex-1">

          {menuItems.map((item) => {

            const Icon = item.icon;

            const active =
              activePage === item.name;

            return (

              <button
                key={item.name}
                onClick={() =>
                  setActivePage(item.name)
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  active
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:bg-white/10 hover:text-white"
                }`}
              >

                <Icon size={20} />

                {item.name}

              </button>

            );

          })}

        </div>

        {/* USER PROFILE */}

        <div className="border-t border-white/10 pt-5">

          <div className="flex items-center gap-3">

            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">

              {currentUser?.name
                ?.charAt(0)
                .toUpperCase()}

            </div>

            <div className="min-w-0">

              <p className="font-medium truncate">
                {currentUser?.name}
              </p>

              <p className="text-xs text-neutral-500 truncate">

                {currentUser?.designation ||
                  "Faculty Member"}

              </p>

            </div>

          </div>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-red-400 hover:bg-red-500/10 transition"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="flex-1 p-6 md:p-10">

        {/* TOP BAR */}

        <div className="flex items-center justify-between mb-10">

          <div>

            <p className="text-sm text-neutral-500">
              Faculty Performance Portal
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-1">

              {activePage}

            </h1>

          </div>

          <div className="flex items-center gap-4">

            <button className="p-3 rounded-xl border border-white/10 hover:bg-white/10">
              <Search size={20} />
            </button>

            <button className="p-3 rounded-xl border border-white/10 hover:bg-white/10">
              <Bell size={20} />
            </button>

            <button
              onClick={() =>
                setActivePage("Publications")
              }
              className="hidden sm:flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-medium hover:scale-105 transition"
            >

              <Plus size={18} />

              Add Activity

            </button>

          </div>

        </div>

        {/* ================= OVERVIEW ================= */}

        {activePage === "Overview" && (

          <>

            {/* LOADING */}

            {loadingDashboard ? (

              <div className="flex items-center justify-center h-64 text-neutral-400">
                Loading dashboard...
              </div>

            ) : (

              <>

                {/* STAT CARDS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                  {stats.map((stat) => (

                    <div
                      key={stat.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06] transition"
                    >

                      <p className="text-sm text-neutral-400">
                        {stat.title}
                      </p>

                      <h2 className="text-4xl font-bold mt-3">
                        {stat.value}
                      </h2>

                      <p className="text-sm text-green-400 mt-3">
                        {stat.change}
                      </p>

                    </div>

                  ))}

                </div>

                {/* PERFORMANCE OVERVIEW */}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

                  {/* BAR CHART */}

                  <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                    <div className="flex justify-between items-center mb-8">

                      <div>

                        <h2 className="text-xl font-semibold">
                          Performance Overview
                        </h2>

                        <p className="text-sm text-neutral-500 mt-1">
                          Academic activities from your database
                        </p>

                      </div>

                      <BarChart3 className="text-blue-400" />

                    </div>

                    <div className="h-56 flex items-end justify-between gap-5">

                      {chartData.map(
                        (value, index) => {

                          const height =
                            Math.max(
                              (value / maxChartValue) *
                                100,
                              value > 0 ? 10 : 2
                            );

                          return (

                            <div
                              key={chartLabels[index]}
                              className="flex flex-col items-center flex-1 h-full justify-end"
                            >

                              <span className="text-xs text-neutral-400 mb-2">
                                {value}
                              </span>

                              <div
                                className="w-full rounded-t-lg bg-blue-400/70 hover:bg-blue-400 transition"
                                style={{
                                  height: `${height}%`,
                                }}
                              />

                              <span className="text-xs text-neutral-500 mt-3 text-center">
                                {chartLabels[index]}
                              </span>

                            </div>

                          );

                        }
                      )}

                    </div>

                  </div>

                  {/* PERFORMANCE SCORE */}

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col items-center justify-center">

                    <p className="text-sm text-neutral-400">
                      Overall Performance
                    </p>

                    <div className="mt-8 h-36 w-36 rounded-full border-[10px] border-blue-400 flex items-center justify-center">

                      <span className="text-4xl font-bold">
                        {performanceScore}%
                      </span>

                    </div>

                    <p className="mt-6 text-green-400 text-sm">
                      Based on academic activities
                    </p>

                  </div>

                </div>

                {/* RECENT ACTIVITIES */}

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                  <h2 className="text-xl font-semibold">
                    Recent Activities
                  </h2>

                  <p className="text-sm text-neutral-500 mt-1 mb-6">
                    Your latest academic contributions
                  </p>

                  <div className="space-y-4">

                    {recentActivities.length > 0 ? (

                      recentActivities.map(
                        (activity, index) => (

                          <div
                            key={`${activity.title}-${index}`}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4"
                          >

                            <div>

                              <h3 className="font-medium">
                                {activity.title}
                              </h3>

                              <p className="text-sm text-neutral-500 mt-1">
                                {activity.description}
                              </p>

                            </div>

                            <span className="text-xs text-neutral-500">
                              {formatDate(
                                activity.date
                              )}
                            </span>

                          </div>

                        )
                      )

                    ) : (

                      <div className="text-center py-10 text-neutral-500">
                        No activities added yet.
                        Add publications, workloads, FDPs, consultancies, or patents to see them here.
                      </div>

                    )}

                  </div>

                </div>

              </>

            )}

          </>

        )}

        {/* ================= FACULTY PROFILE ================= */}

        {activePage === "Faculty Profile" && (
          <FacultyProfile />
        )}

        {/* ================= TEACHING WORKLOAD ================= */}

        {activePage === "Teaching Workload" && (
          <TeachingWorkload />
        )}

        {/* ================= PUBLICATIONS ================= */}

        {activePage === "Publications" && (
          <Publications />
        )}

        {/* ================= FDPS ================= */}

        {activePage === "FDPs & Certifications" && (
          <FDPs />
        )}

        {/* ================= CONSULTANCY ================= */}

        {activePage === "Consultancy" && (
          <Consultancy />
        )}

        {/* ================= PATENTS ================= */}

        {activePage === "Patents" && (
          <Patents />
        )}

        {/* ================= ANALYTICS ================= */}

        {activePage === "Analytics" && (
          <Analytics />
        )}

      </main>

    </div>
  );
}

export default App;