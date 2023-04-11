import cors from "cors";
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

const corsOptions = {
    origin: "http://127.0.0.1:5173", // Especifica el origen de la solicitud
    methods: ["POST", "GET"], // Especifica los métodos
    credentials: true, // Habilita el envío de credenciales (cookies, autenticación)
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// Se obtienen todos los registros por ID
app.get("/todos/:id", async (req, res) => {
    const todos = await getTodosById(req.params.id);
    res.status(200).send(todos);
});

// Se obtienen los todos compartidos por id
app.get("/todos/shared_todos/:id", async (req, res) => {
    const todo = await getSharedTodoById(req.params.id);
    const author = await getUserById(todo.user_id);
    const shared_with = await getUserById(todo.shared_with_id);
    res.status(200).send({author, shared_with});
});

// Se obtienen los ususarios por id
app.get("/users/:id", async (req, res) => {
    const user = await getUserById(req.params.id);
    res.status(200).send(user);
});

// Se actualizan los todos por id
app.put("/todos/:id", async (req, res) => {
    const {value} = req.body;
    const todo = await toggleCompleted(req.params.id, value);
    res.status(200).send(todo);
});

// Se borran los todos por id
app.delete("/todos/:id", async (req, res) => {
    await deleteTodo(req.params.id);
    res.send({ message: "Todo deleted successfully" });
});

// Se muestran los todos compartidos
app.post("/todos/shared_todos", async (req, res) => {
    const {todo_id, user_id, email} = req.body;
    // const {todo_id, user_id, shared_with_id} = req.body;
    const userToShared = await getUserByEmail(email);
    const sharedTodo =  await shareTodo(todo_id, user_id, userToShared.id);
    res.status(201).send(sharedTodo);
});

// Se muestran los todos
app.post("/todos", async (req, res) => {
    const {user_id, title} = req.body;
    const todo = await createTodo(user_id, title);
    res.status(201).send(todo);
});

// Se configura el puerto. Ej: http://localhost:8081
app.listen(8081, () => {
    console.log("Server running on port 8081");
});