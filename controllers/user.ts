import dataSource from "../db/dataSource.js";
import { Profile } from "../db/entities/Profile.js";
import { Role } from "../db/entities/Role.js";
import { User } from "../db/entities/User.js";
import { NSUser } from "../types/user.js";

const createUser = async (payload: NSUser.Item) => {
  return dataSource.manager.transaction(async (transaction) => {
    const [firstName, ...lastName] = payload.name.split(" ")
    const profile = Profile.create({
      firstName,
      lastName:lastName.join(" "),
      dateOfBirth : payload.dateOfBirth || '',
      status: payload.status
    })
    await transaction.save(profile)
    const newUser = User.create(payload);
    newUser.roles=[];
    newUser.peofile=profile;
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

const getUser = async( payload:{id:string})=>{
  return await User.findOne({where:{id:payload.id}, relations:["roles", "roles.permissions"]})

}
export{createUser, editUser, getUser}
