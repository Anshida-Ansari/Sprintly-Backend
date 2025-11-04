import mongoose from "mongoose";

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
      enum: ["SuperAdmin", "Admin","Developers"],
      default: "Employee",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: function () {
        return this.role !== "SuperAdmin"; 
      },
    },
    companyname: {
      type: String,
      require: true,
      trim:true
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
  },
 
{
    timestamps: true, 
}
)

