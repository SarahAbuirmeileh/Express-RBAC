import express from 'express';
import { validateUser } from '../middlewares/validation/user.js';
import { createUser, editUser, getUser, login,getUsers, deleteUser } from '../controllers/user.js';
import { validateEditUser } from '../middlewares/validation/editUser.js';
import { authorize } from '../middlewares/auth/authorize.js';
import { authenticate } from '../middlewares/auth/authenticate.js';
import { User } from '../db/entities/User.js';

var router = express.Router();

router.post('/', validateUser, (req, res, next) => {
  createUser(req.body).then(() => {
    res.status(201).send("User created successfully!!")
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
});

router.put("/",authenticate, authorize("EDIT_user"),validateEditUser, async (req, res, next) => {
  const currentUser = await User.findOne({where:{name:res.locals.user.name, email:res.locals?.user.email},relations:["roles","roles.permissions"]}) || new User()

  editUser(req.body,currentUser).then(() => {
    res.status(201).send("User edited successfully!!")
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
});

router.get("/:id", authenticate,authorize("GET_user"),async (req, res) => {
    const id = req.params.id

    getUser({id}).then((data) => {
      console.log(data);
      
      res.status(201).send(data)
    }).catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
})

router.get('/', authenticate, authorize('READ_users'), async (req, res, next) => {
  const payload = {
    page: req.query.page?.toString() || '1',
    pageSize: req.query.pageSize?.toString() || '10'
  };

  const currentUser = await User.findOne({where:{name:res.locals.user.name, email:res.locals?.user.email},relations:["roles","roles.permissions"]}) || new User()
  getUsers(payload, currentUser)
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Something went wrong');
    });
});


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

router.delete('/:id',authenticate,authorize("DELETE_user"),async (req,res)=>{

  const id = req.params.id?.toString() || "";
  const currentUser = await User.findOne({where:{name:res.locals.user.name, email:res.locals?.user.email},relations:["roles","roles.permissions"]}) || new User()

  deleteUser(id,currentUser)
  .then(data => {
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Something went wrong');
  });
})

export default router;

