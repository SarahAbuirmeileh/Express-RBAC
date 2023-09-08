export namespace NSRole {
    export enum Type {
        admin = 'admin',
        user = 'user',
        editor = 'editor'
    }

    export interface Item{
        id?: string,
        name:Type,
        createdAt?:Date,
        permissionsId:string[]
    }
}