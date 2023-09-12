import express from 'express';
import * as EmailValidator from 'email-validator';

const validateUser = (req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ['name', 'email', 'password'];
  const user = req.body;
  const errorList = values.map(key => !user[key] && `${key} is Required!`).filter(Boolean);

  if (user.status && !['Pending', 'Accepted', 'Rejected'].includes(user?.status)) {
    errorList.push('User profile status unknown!');
  }

  if (!EmailValidator.validate(user.email)) {
    errorList.push('Email is not Valid');
  }

  if (user.password.length < 8) {
    errorList.push('Password should contain at least 8 characters!');
  }

  if (errorList.length) {
    res.status(400).send(errorList);
  } else {
    next();
  }
}

export {
  validateUser
}