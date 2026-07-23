import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173/',
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);


export default app;
