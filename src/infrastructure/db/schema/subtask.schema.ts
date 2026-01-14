import { SubTaskStatus } from "@domain/enum/subtask/subtask.status";
import mongoose from "mongoose";

export const subTaskSchema = new mongoose.Schema(
    {
        userStoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserStories",
            required: true,
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Companies",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String, 
            enum: Object.values(SubTaskStatus), 
            default: SubTaskStatus.PENDING,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    },
    {
        timestamps: true,
    }
);