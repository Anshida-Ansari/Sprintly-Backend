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
        isDone: {
            type: Boolean,
            default: false,
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