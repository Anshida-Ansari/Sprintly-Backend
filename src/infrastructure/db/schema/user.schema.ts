import mongoose from "mongoose";
import { Role } from "src/domain/enum/role.enum";
import { Status } from "src/domain/enum/status.enum";

export const userSchema = new mongoose.Schema(
    {
         
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
   name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, 
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.DEVELOPERS,
      required: true,

    },
    status:{
      type:String,
      enum:Object.values(Status),
      default:"pending"
    },
    companyName: {
      type: String
    },
    performanceScore: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    notificationPreferences: {
      emailNotification: {
        type: Boolean,
        default: true,
      },
      pushNotification: {
        type: Boolean,
        default: true,
      },
    },
    adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: function(this:any){
    return this.role !==  Role.ADMIN
    }, 
    index: true
}

  },
 
{
    timestamps: true, 
}
)

