import mongoose from "mongoose";
import { SprintStatus } from "src/domain/enum/sprints/sprints.status";

export const sprintSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Project",
            index: true
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Company",
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        goal: {
            type: String,
            trim: true
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: Object.values(SprintStatus),
            default: SprintStatus.PLANNED
        }
    },
    {
        timestamps: true 
    }
)