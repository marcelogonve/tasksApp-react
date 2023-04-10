import express from "express";
import {
    getTodo,
    shareTodo,
    deleteTodo,
    getTodosById,
    createTodo,
    toggleCompleted,
    getUserByEmail,
    getUserById,
    getSharedTodoById,
} from "./database.js";

const app = express();
app.use(express.json());

// Se obtienen todos los registros por ID
app.get("/todos/:id", async (req, res) => {
    const todos = await getTodosById(req.params.id);
    res.status(200).send(todos);
});

app.listen(8081, () => {
    console.log("Server running on port 8081");
});