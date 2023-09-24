import express from 'express';

const validateRole = (req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ['name',"permissionsId"];
  const role = req.body;
  const errorList = values.map(key => !role[key] && `${key} is Required!`).filter(Boolean);

  if (!['admin', 'user', 'owner'].includes(role.name)) {
    errorList.push('role name unknown!');
  }

  if (errorList.length) {
    res.status(400).send(errorList);
  } else {
    next();
  }
}

export {
    validateRole
}