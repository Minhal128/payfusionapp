import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { env as config } from './config/env';
import authRoutes from "./routes/authRoutes";
import deviceRoutes from './routes/deviceRoutes';
import fundRoutes from './routes/fundRoutes';
import investmentRoutes from './routes/investmentRoutes';
import kycRoutes from './routes/kycRoutes';
import onboardingRoutes from './routes/onboardingRoutes';
import transactionRoutes from './routes/transactionRoutes';
import userRoutes from './routes/userRoutes';
import walletRoutes from './routes/walletRoutes';
import errorHandler from './middleware/errorHandler';
import { responseHandler } from './middleware/responseHandler';

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(responseHandler);

// Database Connection
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

// Health Check Endpoint
app.get('/health', (req, res) => {
    const healthInfo = {
        status: 'up',
        timestamp: new Date(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    };
    
    res.status(200).json(healthInfo);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/fund', fundRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/wallet', walletRoutes);

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'PayFusion API is running',
        documentation: '/api-docs',
        health: '/health'
    });
});

// Error handler middleware - must be after routes
app.use(errorHandler);

// Start the server for local development only
if (process.env.NODE_ENV !== 'production') {
    const PORT = config.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// This export is critical for Vercel
export default app;