import { In } from "typeorm"
import { Permission } from "../db/entities/Permission.js"
import { Role } from "../db/entities/Role.js"
import { NSPermission } from "../types/permission.js"

const creatPermission =async (payload: NSPermission.Item) => {
    const newPermission = Permission.create(payload)
    return newPermission.save();
}

export {creatPermission}