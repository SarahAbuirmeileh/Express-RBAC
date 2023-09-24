export namespace NSRole {
    export enum Type {
        admin = 'admin',
        user = 'user',
        owner = 'owner'
    }

    export interface Item{
        id?: string,
        name:Type,
        createdAt?:Date,
        permissionsId:string[],
        usersId?:string[]
    }
}