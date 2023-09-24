import express from 'express';
import { validatePermission } from '../middlewares/validation/permission.js'; 
import { creatPermission } from '../controllers/permission.js'; 
import { authorize } from '../middlewares/auth/authorize.js';

var router = express.Router();

router.post('/', validatePermission, (req, res, next) => {
    creatPermission(req.body).then(() => {
    res.status(201).send("Permission created successfully!!")
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
});

export default router;

