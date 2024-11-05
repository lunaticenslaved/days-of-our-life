import { UserService } from '#server/services/user';
import { NextFunction, Request, Response } from 'express';

export async function addUserFromCookie(
  request: Request,
  res: Response,
  next: NextFunction,
) {
  const { cookies } = request;
  const accessToken = cookies['accessToken'];

  try {
    const user = await UserService.getByAccessToken(accessToken);

    if (user) {
      res.locals.user = user || undefined;
    }
  } catch (error) {
    console.log('Cannot get user from token');
  }

  next();
}
