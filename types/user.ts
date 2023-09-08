export namespace NSUser {

  export enum Type {
    Pending= 'Pending' ,
    Accepted= 'Accepted', 
    Rejected='Rejected'
  }

  export interface Item {
    id?: string;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    dateOfBirth?: Date;
    status: Type 
  }
}