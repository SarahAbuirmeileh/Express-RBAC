export namespace NSPermission {

    export interface Item{
        id?: string,
        name:string,
        rolesIds?:string[],
        createdAt?:Date
    }
}