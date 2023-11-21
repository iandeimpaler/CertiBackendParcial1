import express, { Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { AppDataSource } from './infrastructure/config/dataSource';
import { Express } from 'express-serve-static-core';
import { env } from './infrastructure/config/config';
import logger from './infrastructure/logger/logger';
import { apiRoutes } from './api/controllers/apiRoutes';
import { limiter } from './api/middleware/rate.limiter';

AppDataSource.initialize().then(() => {
    const app = express();
    dotenv.config();

    const PORT = env.port;

    app.use(express.json());
    app.use(limiter);

    // Setup Logger 
    app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));

    app.get('/', (req: Request, res: Response) => {
        res.send('Servidor Up');
    });

    app.use('/api', apiRoutes());

    app.use(
        morgan("combined", {
          stream: { write: (message: string) => logger.info(message.trim()) },
        })
      );

    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
}).catch(error => console.log(error));
