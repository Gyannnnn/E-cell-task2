const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoModel = require('./models/Todo');

const app = express();

app.use(cors({
    origin: ["https://e-cell-task2-frontend.vercel.app"],
    methods: ["POST", "GET", "DELETE"],
    credentials: true
}));

app.use(express.json());

mongoose.connect('mongodb+srv://higyanaranjanpatra:gyan@mongodb1@cluster0.b6xliqj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

app.get("/", (req, res) => {
    res.json("Working fine");
});

app.get('/get', (req, res) => {
    todoModel.find()
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err));
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    todoModel.findByIdAndDelete(id)
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err));
});

app.post('/add', async (req, res) => {
    try {
        const task = req.body.task;
        if (!task) {
            return res.status(400).json({ error: "Task is required" });
        }
        const newTask = await todoModel.create({ task });
        res.json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
