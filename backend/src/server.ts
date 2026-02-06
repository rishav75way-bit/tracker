import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import router from './app/router';
import { errorHandler } from './app/common/middleware/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', router);

app.use(errorHandler);

const startServer = async (): Promise<void> => {
    await connectDatabase();

    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });
};

startServer().catch((error) => {
    console.error('Unexpected error:', error);
});
