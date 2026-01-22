import mongoose from "mongoose";

export const standupSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Projects',
            required: true
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        sprintId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sprints',
            required: true
        },
        yesterday: {
            type: String,
            required: true
        },
        today: {
            type: String,
            required: true
        },
        blockers: {
            type: String
        },
        comments: [{
            userId: String,
            userName: String,
            text: String,
            createdAt: { type: Date, default: Date.now }
        }]
    },
    { timestamps: true }
)