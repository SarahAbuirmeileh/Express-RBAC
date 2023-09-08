export namespace NSPermission {
    export enum Type {
        create_post = 'create_post',
        edit_user = 'edit_user',
        delete_comment = 'delete_comment'
    }

    export interface Item{
        id?: string,
        status:Type,
        createdAt?:Date
    }
}