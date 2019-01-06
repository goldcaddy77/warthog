import { Request, Response } from 'express';

export function healthCheckMiddleware(req: Request, res: Response) {
  res.send({ data: 'alive' });
  return Promise.resolve();
}
