import dataSource from "../db/dataSource.js";
import { Profile } from "../db/entities/Profile.js";
import { Role } from "../db/entities/Role.js";
import { User } from "../db/entities/User.js";
import { NSUser } from "../types/user.js";
import jwt from 'jsonwebtoken';
import { In } from 'typeorm';

const login = async (email: string, name: string) => {
  try {
    const user = await User.findOneBy({
      email,
      name
    });

    if (user) {
      const token = jwt.sign(
        {
          email: user.email,
          name: user.name
        },
        process.env.SECRET_KEY || '',
        {
          expiresIn: "2w"
        }
      );

      return token;
    } else {
      throw ("Invalid email or name!");
    }
  } catch (error) {
    throw ("Invalid email or name!");
  }
}

const createUser = async (payload: NSUser.Item) => {
  return dataSource.manager.transaction(async (transaction) => {
    const [firstName, ...lastName] = payload.name.split(" ")
    const profile = Profile.create({
      firstName,
      lastName: lastName.join(" "),
      dateOfBirth: payload.dateOfBirth || '',
      status: payload?.status
    })
    await transaction.save(profile)
    const newUser = User.create(payload);
    newUser.roles = [];
    newUser.profile = profile;
    await transaction.save(newUser);
  });
};


const getUser = async (payload: { id: string }) => {
  return await User.findOne({ where: { id: payload.id }, relations: ["roles", "roles.permissions"] })
}

const getUsers = async (payload: {
  page: string,
  pageSize: string
}, user: User) => {

  const page = parseInt(payload.page);
  const pageSize = parseInt(payload.pageSize);
  const roles = user.roles;
  const permissions: string[] = [];

  const hasAdminPermission = roles.some(role =>
    role.permissions.some(permission => permission.name === 'READ-admin')
  );

  const hasUserPermission = roles.some(role =>
    role.permissions.some(permission => permission.name === 'READ-user')
  );

  const hasOwnerPermission = roles.some(role =>
    role.permissions.some(permission => permission.name === 'READ-owner')
  );

  if (hasAdminPermission) {
    permissions.push("admin")
  }
  if (hasUserPermission) {
    permissions.push("user")
  }
  if (hasOwnerPermission) {
    permissions.push("owner")
  }

  const [users, total] = await User.findAndCount({
    skip: pageSize * (page - 1),
    take: pageSize,
    where: { type: In(permissions) },
    order: {
      createdAt: 'ASC'
    }
  })

  return {
    page,
    pageSize: users.length,
    total,
    users
  };
}

const editUser = async (payload: { roleId: string, userId: string }, currentUser: User) => {
  const user = await User.findOne({ where: { id: payload.userId }, relations: ["roles"] });
  const role = await Role.findOne({ where: { id: payload.roleId } });
  const roles = currentUser.roles;

  const hasEditPermission = roles.some(role =>
    role.permissions.some(permission => permission.name === `READ-${user?.type}`)
  );

  if (!hasEditPermission) {
    return `You don't have a permission to edit ${user?.type}`
  }

  if (user && role) {
    const hasRole = user.roles.some((existingRole) => existingRole.id === role.id);

    if (!hasRole) {
      user.roles.push(role);
      return user.save();
    } else {
      return "User already has this role.";
    }
  } else {
    if (!user) {
      return "User not found :(";
    } else {
      return "Role not found :(";
    }
  }
}

const deleteUser = async(userId:string)=>{
  return User.delete(userId)
}

// const getUsers = async (payload: {
//   page: string,
//   pageSize: string
// }, currentUser: User) => {
//   const roles = currentUser.roles;

//   const hasAdminPermission = roles.some(role =>
//     role.permissions.some(permission => permission.name === 'READ-admin')
//   );

//   let queryBuilder = getRepository(User)
//     .createQueryBuilder('user');

//   // Modify the query based on permissions
//   if (hasAdminPermission) {
//     // If the user has "READ-admin" permission, filter for admins
//     queryBuilder = queryBuilder.where('user.type = :type', { type: 'admin' });
//   } else {
//     // If not, filter for regular users
//     queryBuilder = queryBuilder.where('user.type = :type', { type: 'user' });
//   }

//   // ... Rest of the code remains the same ...
// };

// const getUsers = async (payload: {
//   page: string,
//   pageSize: string
// }, currentUser: User) => {
//   const page = parseInt(payload.page);
//   const pageSize = parseInt(payload.pageSize);

//   const roles = currentUser.roles;
//   const hasAdminPermission = roles.some(role =>
//     role.permissions.some(permission => permission.name === 'READ-admin')
//   );

//   try {
//     let query = {
//       skip: pageSize * (page - 1),
//       take: pageSize,
//       order: {
//         createdAt: 'ASC'
//       },
//     };

//     if (hasAdminPermission) {
//       // If the user has "READ-admin" permission, filter for admins
//       query = {
//         ...query,
//         where: { type: 'admin' }
//       };
//     } else {
//       // If not, filter for regular users
//       query = {
//         ...query,
//         where: { type: 'user' }
//       };
//     }

//     const [users, total] = await User.findAndCount(query);

//     return {
//       page,
//       pageSize: users.length,
//       total,
//       users
//     };
//   } catch (error) {
//     console.error(error);
//     throw new Error('Something went wrong');
//   }
// };


// const getUsers = async (payload: {
//   page: string,
//   pageSize: string
// }, currentUser: User) => {
//   const page = parseInt(payload.page);
//   const pageSize = parseInt(payload.pageSize);

//   const roles = currentUser.roles;
//   const hasAdminPermission = roles.some(role =>
//     role.permissions.some(permission => permission.name === 'READ-admin')
//   );

//   try {
//     let query: SelectQueryBuilder<User> = getRepository(User)
//       .createQueryBuilder('user')
//       .skip(pageSize * (page - 1))
//       .take(pageSize)
//       .orderBy('user.createdAt', 'ASC');

//     if (!hasAdminPermission) {
//       // If the user does not have "READ-admin" permission, filter for regular users
//       query = query.where('user.type = :type', { type: 'user' });
//     }

//     const [users, total] = await query.getManyAndCount();

//     return {
//       page,
//       pageSize: users.length,
//       total,
//       users
//     };
//   } catch (error) {
//     console.error(error);
//     throw new Error('Something went wrong');
//   }
// };


export {
  createUser,
  editUser,
  getUser,
  login,
  getUsers,
  deleteUser
}
