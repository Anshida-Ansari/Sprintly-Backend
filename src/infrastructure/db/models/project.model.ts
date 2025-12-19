import { model } from "mongoose";
import { IProject } from "../interface/project.interface";
import { projectSchema } from "../schema/projects.schema";

export const ProjectModel = model<IProject>("Project",projectSchema)