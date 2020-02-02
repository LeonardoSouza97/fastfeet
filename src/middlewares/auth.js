import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../config/auth';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: 'Token não encontrado' });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
  } catch (error) {
    res.status(400).json({ error });
  }

  next();
};
