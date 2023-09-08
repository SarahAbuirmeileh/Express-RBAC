import express from 'express';

const validateEditUser = (req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ['userId', 'roleId'];
  const role = req.body;
  const errorList = values.map(key => !role[key] && `${key} is Required!`).filter(Boolean);

  if (errorList.length) {
    res.status(400).send(errorList);
  } else {
    next();
  }
}

export {
    validateEditUser
}