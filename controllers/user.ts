import dataSource from "../db/dataSource.js";
import { Profile } from "../db/entities/Profile.js";
import { Role } from "../db/entities/Role.js";
import { User } from "../db/entities/User.js";
import { NSUser } from "../types/user.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const login = async (email: string, password: string) => {
  try {
      const user = await User.findOneBy({
        email
    });
    
    
    const passwordMatching = await bcrypt.compare(password, user?.password || '');
    if (user && passwordMatching) {
      const token = jwt.sign(
        {
          email: user.email,
          name: user.name
        },
        process.env.SECRET_KEY || '',
        {
          expiresIn: "30m"
        }
      );

      return token;
    } else {
      throw ("Invalid email or password!");
    }
  } catch (error) {
    throw ("Invalid email or password!");
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

const editUser = async (payload: { roleId: string, userId: string }) => {
  const user = await User.findOne({ where: { id: payload.userId }, relations: ["roles"] });
  const role = await Role.findOne({ where: { id: payload.roleId } });

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

const getUser = async (payload: { id: string }) => {
  return await User.findOne({ where: { id: payload.id }, relations: ["roles", "roles.permissions"] })

}
export {
  createUser,
  editUser,
  getUser,
  login
}
