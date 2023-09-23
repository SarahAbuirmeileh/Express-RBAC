import express from 'express';
import { validateUser } from '../middlewares/validation/user.js';
import { createUser, editUser, getUser, login } from '../controllers/user.js';
import { validateEditUser } from '../middlewares/validation/editUser.js';

var router = express.Router();

router.post('/', validateUser, (req, res, next) => {
  createUser(req.body).then(() => {
    res.status(201).send("User created successfully!!")
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
});

router.put("/", validateEditUser, (req, res, next) => {
  editUser(req.body).then(() => {
    res.status(201).send("User edited successfully!!")
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
});

router.get("/:id", async (req, res) => {
    const id = req.params.id

    getUser({id}).then((data) => {
      res.status(201).send(data)
    }).catch(err => {
      console.error(err);
      res.status(500).send(err);
    });

})

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  login(email, password)
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(401).send(err);
    })
});

export default router;

