const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const authMiddleware = require("./middleware/authMiddleware");

require("dotenv").config();

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());
app.use(express.json());


// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully 🚀");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


// ======================================================
// PUBLICATIONS MODEL
// ======================================================

const publicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    journal: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Publication = mongoose.model(
  "Publication",
  publicationSchema
);


// ======================================================
// PUBLICATIONS API
// ======================================================

// GET ALL PUBLICATIONS

app.get(
  "/api/publications",
  authMiddleware,
  async (req, res) => {
    try {
      const publications = await Publication.find().sort({
        createdAt: -1,
      });

      res.json(publications);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error fetching publications",
      });
    }
  }
);


// ADD PUBLICATION

app.post(
  "/api/publications",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        journal,
        year,
      } = req.body;

      if (!title || !journal || !year) {
        return res.status(400).json({
          message: "Please provide title, journal, and year",
        });
      }

      const newPublication = new Publication({
        title,
        journal,
        year,
      });

      await newPublication.save();

      res.status(201).json(newPublication);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error adding publication",
      });
    }
  }
);


// UPDATE PUBLICATION

app.put(
  "/api/publications/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const updatedPublication =
        await Publication.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument: "after",
            runValidators: true,
          }
        );

      if (!updatedPublication) {
        return res.status(404).json({
          message: "Publication not found",
        });
      }

      res.json(updatedPublication);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error updating publication",
      });
    }
  }
);


// DELETE PUBLICATION

app.delete(
  "/api/publications/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const deletedPublication =
        await Publication.findByIdAndDelete(
          req.params.id
        );

      if (!deletedPublication) {
        return res.status(404).json({
          message: "Publication not found",
        });
      }

      res.json({
        message: "Publication deleted successfully",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error deleting publication",
      });
    }
  }
);


// ======================================================
// TEACHING WORKLOAD MODEL
// ======================================================

const teachingWorkloadSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    hours: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TeachingWorkload = mongoose.model(
  "TeachingWorkload",
  teachingWorkloadSchema
);


// ======================================================
// TEACHING WORKLOAD API
// ======================================================

// GET WORKLOADS

app.get(
  "/api/workloads",
  authMiddleware,
  async (req, res) => {
    try {
      const workloads =
        await TeachingWorkload.find().sort({
          createdAt: -1,
        });

      res.json(workloads);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error fetching workloads",
      });
    }
  }
);


// ADD WORKLOAD

app.post(
  "/api/workloads",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        subject,
        courseCode,
        semester,
        hours,
      } = req.body;

      if (
        !subject ||
        !courseCode ||
        !semester ||
        !hours
      ) {
        return res.status(400).json({
          message: "Please fill in all fields",
        });
      }

      const newWorkload =
        new TeachingWorkload({
          subject,
          courseCode,
          semester,
          hours,
        });

      await newWorkload.save();

      res.status(201).json(newWorkload);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error adding workload",
      });
    }
  }
);


// UPDATE WORKLOAD

app.put(
  "/api/workloads/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const updatedWorkload =
        await TeachingWorkload.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument: "after",
            runValidators: true,
          }
        );

      if (!updatedWorkload) {
        return res.status(404).json({
          message: "Workload not found",
        });
      }

      res.json(updatedWorkload);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error updating workload",
      });
    }
  }
);


// DELETE WORKLOAD

app.delete(
  "/api/workloads/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const deletedWorkload =
        await TeachingWorkload.findByIdAndDelete(
          req.params.id
        );

      if (!deletedWorkload) {
        return res.status(404).json({
          message: "Workload not found",
        });
      }

      res.json({
        message: "Workload deleted successfully",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error deleting workload",
      });
    }
  }
);


// ======================================================
// FDP MODEL
// ======================================================

const fdpSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FDP = mongoose.model(
  "FDP",
  fdpSchema
);


// ======================================================
// FDP API
// ======================================================

app.get(
  "/api/fdps",
  authMiddleware,
  async (req, res) => {
    try {
      const fdps = await FDP.find().sort({
        createdAt: -1,
      });

      res.json(fdps);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error fetching FDPs",
      });
    }
  }
);


app.post(
  "/api/fdps",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        organization,
        duration,
        year,
      } = req.body;

      if (
        !title ||
        !organization ||
        !duration ||
        !year
      ) {
        return res.status(400).json({
          message: "Please fill in all fields",
        });
      }

      const newFdp = new FDP({
        title,
        organization,
        duration,
        year,
      });

      await newFdp.save();

      res.status(201).json(newFdp);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error adding FDP",
      });
    }
  }
);


app.put(
  "/api/fdps/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const updatedFdp =
        await FDP.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument: "after",
            runValidators: true,
          }
        );

      if (!updatedFdp) {
        return res.status(404).json({
          message: "FDP not found",
        });
      }

      res.json(updatedFdp);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error updating FDP",
      });
    }
  }
);


app.delete(
  "/api/fdps/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const deletedFdp =
        await FDP.findByIdAndDelete(
          req.params.id
        );

      if (!deletedFdp) {
        return res.status(404).json({
          message: "FDP not found",
        });
      }

      res.json({
        message: "FDP deleted successfully",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error deleting FDP",
      });
    }
  }
);


// ======================================================
// CONSULTANCY MODEL
// ======================================================

const consultancySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Consultancy = mongoose.model(
  "Consultancy",
  consultancySchema
);


// ======================================================
// CONSULTANCY API
// ======================================================

app.get(
  "/api/consultancies",
  authMiddleware,
  async (req, res) => {
    try {
      const consultancies =
        await Consultancy.find().sort({
          createdAt: -1,
        });

      res.json(consultancies);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error fetching consultancies",
      });
    }
  }
);


app.post(
  "/api/consultancies",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        client,
        amount,
        status,
      } = req.body;

      if (
        !title ||
        !client ||
        !amount ||
        !status
      ) {
        return res.status(400).json({
          message: "Please fill in all fields",
        });
      }

      const newConsultancy =
        new Consultancy({
          title,
          client,
          amount,
          status,
        });

      await newConsultancy.save();

      res.status(201).json(newConsultancy);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error adding consultancy",
      });
    }
  }
);


app.put(
  "/api/consultancies/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const updatedConsultancy =
        await Consultancy.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument: "after",
            runValidators: true,
          }
        );

      if (!updatedConsultancy) {
        return res.status(404).json({
          message: "Consultancy not found",
        });
      }

      res.json(updatedConsultancy);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error updating consultancy",
      });
    }
  }
);


app.delete(
  "/api/consultancies/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const deletedConsultancy =
        await Consultancy.findByIdAndDelete(
          req.params.id
        );

      if (!deletedConsultancy) {
        return res.status(404).json({
          message: "Consultancy not found",
        });
      }

      res.json({
        message: "Consultancy deleted successfully",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error deleting consultancy",
      });
    }
  }
);


// ======================================================
// PATENT MODEL
// ======================================================

const patentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    applicationNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Patent = mongoose.model(
  "Patent",
  patentSchema
);


// ======================================================
// PATENT API
// ======================================================

app.get(
  "/api/patents",
  authMiddleware,
  async (req, res) => {
    try {
      const patents = await Patent.find().sort({
        createdAt: -1,
      });

      res.json(patents);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error fetching patents",
      });
    }
  }
);


app.post(
  "/api/patents",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        applicationNumber,
        status,
        year,
      } = req.body;

      if (
        !title ||
        !applicationNumber ||
        !status ||
        !year
      ) {
        return res.status(400).json({
          message: "Please fill in all fields",
        });
      }

      const newPatent = new Patent({
        title,
        applicationNumber,
        status,
        year,
      });

      await newPatent.save();

      res.status(201).json(newPatent);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error adding patent",
      });
    }
  }
);


app.put(
  "/api/patents/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const updatedPatent =
        await Patent.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument: "after",
            runValidators: true,
          }
        );

      if (!updatedPatent) {
        return res.status(404).json({
          message: "Patent not found",
        });
      }

      res.json(updatedPatent);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error updating patent",
      });
    }
  }
);


app.delete(
  "/api/patents/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const deletedPatent =
        await Patent.findByIdAndDelete(
          req.params.id
        );

      if (!deletedPatent) {
        return res.status(404).json({
          message: "Patent not found",
        });
      }

      res.json({
        message: "Patent deleted successfully",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error deleting patent",
      });
    }
  }
);


// ======================================================
// DASHBOARD API
// ======================================================

app.get(
  "/api/dashboard",
  authMiddleware,
  async (req, res) => {
    try {
      const [
        publications,
        workloads,
        fdps,
        consultancies,
        patents,
      ] = await Promise.all([
        Publication.find(),
        TeachingWorkload.find(),
        FDP.find(),
        Consultancy.find(),
        Patent.find(),
      ]);

      // Calculate total teaching hours

      const totalWorkloadHours = workloads.reduce(
        (total, workload) => {
          const hours = parseFloat(workload.hours);

          return total + (isNaN(hours) ? 0 : hours);
        },
        0
      );

      // Combine recent activities

      const activities = [

        ...publications.map((item) => ({
          type: "Research Publication",
          description: item.title,
          createdAt: item.createdAt,
        })),

        ...workloads.map((item) => ({
          type: "Teaching Activity",
          description: item.subject,
          createdAt: item.createdAt,
        })),

        ...fdps.map((item) => ({
          type: "FDP & Certification",
          description: item.title,
          createdAt: item.createdAt,
        })),

        ...consultancies.map((item) => ({
          type: "Consultancy",
          description: item.title,
          createdAt: item.createdAt,
        })),

        ...patents.map((item) => ({
          type: "Patent",
          description: item.title,
          createdAt: item.createdAt,
        })),

      ]
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5);

      // Calculate performance score

      const performanceScore = Math.min(
        100,

        publications.length * 10 +
        fdps.length * 5 +
        patents.length * 15 +
        consultancies.length * 10 +
        workloads.length * 5
      );

      res.json({
        publications: publications.length,
        workloads: workloads.length,
        fdps: fdps.length,
        consultancies: consultancies.length,
        patents: patents.length,

        totalWorkloadHours,

        performanceScore,

        recentActivities: activities,
      });

    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      res.status(500).json({
        message: "Error fetching dashboard data",
      });
    }
  }
);


// ======================================================
// AUTHENTICATION
// ======================================================

// REGISTER USER

app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      designation,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      department,
      designation,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});


// LOGIN USER

app.post("/api/auth/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        designation: user.designation,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});


// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "FacultyInsight Backend is Running 🚀",
  });
});


// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} 🚀`
  );
});