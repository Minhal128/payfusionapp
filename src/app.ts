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

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(responseHandler);
app.use(errorHandler);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/fund', fundRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/wallet', walletRoutes);

// Database Connection
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

// Start the server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});