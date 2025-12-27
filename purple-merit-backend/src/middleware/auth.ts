import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Extend the Express Request type so we can attach 'user' to it
export interface AuthRequest extends Request {
  user?: any;
}

// 2. Main Authentication Middleware
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get token from header (Format: "Bearer <token>")
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access Denied: No token provided' });
  }

  try {
    // Verify the token using your secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified; // Attach user data to request
    next(); // Move to the next function
  } catch (err) {
    res.status(400).json({ error: 'Invalid Token' });
  }
};

// 3. Role-Based Authorization Middleware
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission' });
    }
    next();
  };
};