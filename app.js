const express = require("express");
const cors = require("cors");
const logRequest = require("./middleware/logger");
const validator = require("./middleware/validator");
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const { validatorTodo, patchValidator } = require("./middleware/validator");
const app = express();
app.use(cors()); // Allow CORS from any origin
app.use(express.json()); // Parse JSON bodies
const PORT = process.env.PORT || 3000;
app.use(logRequest);

let todos = [
  { id: 1, task: "Learn Node.js", completed: true },
  { id: 2, task: "Build CRUD API", completed: false },
  { id: 3, task: "submit assignment", completed: false },
  { id: 4, task: "review code", completed: false },
];

// GET All – Read
app.get("/todos", (req, res, next) => {
  try {
    res.status(200).json(todos); // Send array as JSON
  } catch (err) {
    next(err);
  }
});

// POST New – Create
app.post("/todos", validatorTodo, (req, res, next) => {
  try {
    const { task } = req.body;
    const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
    if (!task) {
      return res.status(400).json({
        message: "Task field is required",
      });
    }
    todos.push(newTodo);
    res.status(201).json(newTodo); // Echo back
  } catch (err) {
    next(err);
  }
});

// PATCH Update – Partial
app.patch("/todos/:id", patchValidator, (req, res, next) => {
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    Object.assign(todo, req.body); // Merge: e.g., {completed: true}
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
});

// DELETE Remove
app.delete("/todos/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
    if (todos.length === initialLength)
      return res.status(404).json({ error: "Not found" });
    res.status(204).send(); // Silent success
  } catch (err) {
    next(err);
  }
});

app.get("/todos/completed", (req, res, next) => {
  try {
    const completed = todos.filter((t) => t.completed);
    res.json(completed); // Custom Read!
  } catch (err) {
    next(err);
  }
});
app.get("/todos/active", (req, res, next) => {
  try {
    const completed = todos.filter((t) => !t.completed);
    res.json(completed); // Custom Read!
  } catch (err) {
    next(err);
  }
});

// Get single todo
app.get("/todos/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(todo);
  } catch (err) {
    next(err);
  }
});

// app.use((err, req, res, next) => {
//   res.status(500).json({ error: "Server error!" });
// });
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
