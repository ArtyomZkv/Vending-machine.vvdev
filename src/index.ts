import express from 'express';

const app = express();
app.use(express.json());

app.get('/machine', (req, res) => {
    res.json({ message: 'Machine is alive'});
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});