import mongoose from "mongoose";
import { PriorityStatus } from "src/domain/enum/userstory/user.story.priority";
import { UserStoryStatus } from "src/domain/enum/userstory/user.story.status";

export const userStorySchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: "",
            trim: true
        },
        status: {
            type: String,
            enum: Object.values(UserStoryStatus),
            default: UserStoryStatus.IN_PENDING
        },
        priority: {
            type: String,
            enum: Object.values(PriorityStatus),
            default: PriorityStatus.MEDIUM
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            res: "Companies",
            required: true
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            res: "Users"
        },
        sprintId: {
            type: mongoose.Schema.Types.ObjectId,
            res: "Sprints",

        }
    },
    {
        timestamps: true,
    }
)