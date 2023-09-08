import express from "express"
import { Role } from "../db/entities/Role.js"
import { NSRole } from "../types/role.js"
import { Permission } from "../db/entities/Permission.js"
import { In } from "typeorm"

const createRole = async (payload: NSRole.Item) => {
    const newRole = Role.create(payload)
    newRole.users = []
    const permissions = await Permission.find({
        where: { id: In(payload.permissionsId) },
      });

    newRole.permissions =permissions
    return newRole.save()
}

export { createRole }