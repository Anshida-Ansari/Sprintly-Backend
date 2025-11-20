import { Role } from "../enum/role.enum";
import { Status } from "../enum/status.enum";

export class UserEntity {
  private readonly _id?: string;
  private _name: string;
  private _email: string;
  private _password: string;
  private _role: Role;
  private _status: Status;
  // private _companyId?: ObjectId;
  private _companyName?: string;
  private _adminId?:string;


  constructor(props: {
    id?: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    status: Status;
    companyName?: string;
    adminId?:string
    
   
  }) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._role = props.role;
    this._status = props.status;
    this._companyName = props.companyName;
    this._adminId = props.adminId;
    
  }

  static create(props: {
    id?: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    status: Status;
    companyName?: string;
    adminId?:string
  }): UserEntity {
     return new UserEntity({ 
      id: props.id,
      name: props.name,
      email: props.email,
      password: props.password,
      role: props.role,
      status: props.status,
      companyName: props.companyName,
      adminId: props.adminId
    });
  }

  get id() { return this._id; }
  get name() { return this._name; }
  get email() { return this._email; }
  get password() { return this._password; }
  get role() { return this._role; }
  get status() { return this._status; }
  get companyName() { return this._companyName; }
  get adminId() { return this._adminId; }

}

