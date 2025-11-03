import { ObjectId } from "mongoose"; 

export class Company {
  constructor(
    public readonly _id: ObjectId,
    public companyname: string,
   
  ) {}
}