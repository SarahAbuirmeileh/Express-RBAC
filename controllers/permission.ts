import express from "express"
import { Permission } from "../db/entities/Permission.js"
import { NSPermission } from "../types/permission.js"

const creatPermission = (payload: NSPermission.Item) => {
    const newPermission = Permission.create(payload)
    newPermission.roles = []
    return newPermission.save()
}

export {creatPermission}