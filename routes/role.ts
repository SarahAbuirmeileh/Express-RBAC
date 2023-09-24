import express from 'express';
import { validateRole } from '../middlewares/validation/role.js'; 
import { createRole } from '../controllers/role.js'; 
import { authorize } from '../middlewares/auth/authorize.js';

var router = express.Router();

router.post('/',validateRole, (req, res, next) => {
    createRole(req.body).then(() => {
    res.status(201).send("role created successfully!!")
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
});

export default router;

