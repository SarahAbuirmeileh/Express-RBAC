import express from 'express';
import * as EmailValidator from 'email-validator';

const validatePermission = (req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["status"];
  const user = req.body;
  const errorList = values.map(key => !user[key] && `${key} is Required!`).filter(Boolean);

  if (!['create_post', 'edit_user', 'delete_comment'].includes(user.status)) {
    errorList.push('Permission status unknown!');
  }

  if (errorList.length) {
    res.status(400).send(errorList);
  } else {
    next();
  }
}

export {
    validatePermission
}