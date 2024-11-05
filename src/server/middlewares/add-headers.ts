import { NextFunction, Request, Response } from 'express';

export async function addHeaders(_: Request, response: Response, next: NextFunction) {
  response.setHeader('X-Frame-Options', 'SAMEORIGIN');

  next();
}
