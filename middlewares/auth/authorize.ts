import express from 'express';
import { NSPermission } from '../../types/permission.js';
import { User } from '../../db/entities/User.js';

const authorize = (api: string) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {

    const user = await User.findOne({ where: { name: res.locals.user.name, email: res.locals.user.email },relations:["roles","roles.permissions"] })
    const permissions: NSPermission.Item[] = [];

    if (user?.roles)
      user.roles.forEach((role) => {
        
        permissions.push(...role.permissions);
      });
            
    if (permissions?.filter(p => p.name === api).length > 0) {
      next();
    } else {
      res.status(403).send("You don't have the permission to access this resource!");
    }
  }
}

export {
  authorize
}