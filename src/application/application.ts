import express, { Express, Router, NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import { RepositryInitializer } from '../repository/repository';
export interface ServerParams { port: number; host: string }
export interface RunResult { port: number; address: string }
export class Application {

    private app: Express;
    private initializers: RepositryInitializer[] = [];

    constructor() {
        this.app = express();
    }

    private now() {
        const date = new Date();
        const pad = (n: number, padSize: number = 2) => String(n).padStart(padSize, '0')
        return [
            [date.getFullYear().toString(),pad(date.getMonth()),pad(date.getDate())].join('-'),
            [pad(date.getHours()),pad(date.getMinutes()),pad(date.getSeconds()),pad(date.getMilliseconds(), 3)].join(':')
        ].join(' ')

    }

    addLogger() {
        const log = (req: Request, res: Response, next: NextFunction) => {
            console.log(`[${this.now()}] ${req.url}`);
            next();
        }
        this.app.use(log)
        return this;
    }


    async init() {
        await Promise.all(this.initializers.map(i => i()));
        return this;
    }

    async run({ port, host }: ServerParams) {

        return new Promise<RunResult>((resolve, reject) => {
            try {
                const server: Server = this.app.listen(port, host, () => {
                    const addressInfo = server.address();
                    resolve({ port, address: typeof addressInfo === 'string' ? addressInfo : addressInfo?.address || '' })
                })
            } catch (error) {
                reject(error);
            }

        })
    }

    addRoutes(path: string, {init, router} : {init: (...args: any[]) => Promise<void>, router: Router}) {
        this.app.use(path, router);
        this.initializers.push(init);
        // this.app.use(path,(req, res) => res.json({hi: 'there'}));
        return this;
    }

    useMiddlewares = (middlewares: any[]) => {
        this.app.use(middlewares);
        return this;
    }

    addErrorResponses = () => {
        this.app.use((error: any, req: Request, res: Response) => {
            console.log(`${error} @ ${req.url}`);
            res.status(500).send('something errored')
        })
        this.app.use((req: Request, res: Response) => {
            console.log(`route not found ${req.url}`)
            res.status(400).send('something not found')
        });
        return this;
    }


}

