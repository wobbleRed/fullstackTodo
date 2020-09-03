require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

//MIDDLEWARE//
// anytime you use a middleware you use an app.use() method
app.use(cors());
app.use(express.json());

//ROUTES//
//create todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "insert into todo (description) values($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//get all todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (error) {
    console.log(error.message);
  }
});
//get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query(
      `SELECT * FROM todo WHERE todo_id = $1`,
      [id]
    );
    res.json(todo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    res.json(`${updateTodo.rowCount} row updated`);
  } catch (error) {
    console.log(error.message);
  }
});

//delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1",
      [id]
    );
    res.json(`${deleteTodo.rowCount} row deleted`);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(5000, () => {
  console.log("listening on 5000");
});
