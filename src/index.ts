import express from 'express';
import machineRoutes from './routes/machine-routes.js';
import { errorHandler } from './middleware/error-handler.js';
import { machine } from './state.js';

const app = express();

app.use(express.json());
app.use(machineRoutes);
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const timer = setInterval(() => {
    if (!machine.tick()) clearInterval(timer);
}, 60000);