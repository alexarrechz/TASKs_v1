require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const Task = require("./models/tasks");
const cors = require("cors");
// const { tasks } = require("diagnostics_channel");

const app = express();
app.use(cors());
app.use(express.static("public"));

mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.on("error", (error) => {
  console.error(error);
});
mongoose.connection.once("open", () => console.log("Connected to Database"));


app.use(express.json());

// Rais
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname,"/index.html"))
})

// GET ALL Primer endpoint, lleva request y response
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// GET tasks by priority
app.get("/tasks/priority/:priority", async (req, res) => {
  const priority = req.params.priority;

  try {
    const tasks = await Task.find({ priority: priority });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ONE Aqui usamos el middleware↓
app.get("/tasks/:id", gettask, async (req, res) => {
  res.json(res.task);
});

app.delete("/tasks/:id", gettask, async (req, res) => {
  await res.task.deleteOne();
  res.json({
    tag: "Element Deleted",
  });
});

// POST TASK into DB
app.post("/task", async (req, res) => {
  try {
    // Extrae los datos de la solicitud del cuerpo (body) de la solicitud
    const { title, deadline, priority } = req.body;

    // Crea una nueva instancia del modelo Task con los datos proporcionados
    const newTask = new Task({ title, deadline, priority });

    // Guarda la nueva tarea en la base de datos
    const savedTask = await newTask.save();

    // Responde con la tarea recién creada
    res.json(savedTask);
  } catch (error) {
    // Si hay algún error durante el proceso, responde con un estado de error y un mensaje
    res.status(500).json({ error: error.message });
  }
});

// PATCH TASK / ACTUALIZAR
// Ruta para actualizar parcialmente una tarea por su ID
app.patch("/tasks/:id", gettask, async (req, res) => {
  if (req.body.title != null) res.task.title = req.body.title;
  if (req.body.deadline != null) res.task.deadline = req.body.deadline;
  if (req.body.completed != null) res.task.completed = req.body.completed;
  if (req.body.priority != null) res.task.priority = req.body.priority;
  try {
    const updatedTasks = await res.task.save();
    res.json(updatedTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LISTENER SERVER IS ON
res = app.listen("3000", () => {
  console.log("Server On");
});

// Middleware
async function gettask(req, res, next) {
  const task = await Task.findById(req.params.id);
  if (!task)
    return res.status(404).json({
      tag: "task not found",
    });

  res.task = task;
  next();
}
