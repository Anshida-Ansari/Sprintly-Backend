import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import { UserStoryModel } from './src/infrastructure/db/models/user.story.schema';
import { ProjectModel } from './src/infrastructure/db/models/project.schema';

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sprintly";

async function fix() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB");

  const stories = await UserStoryModel.find({ adminId: { $exists: false } });
  console.log(`Found ${stories.length} stories missing adminId`);

  for (const story of stories) {
    if (story.projectId) {
      // Typically, project has a project lead or company admin, but simplest is to find a user who might be admin.
      // Often stories have an initial comment or we can just fall back to getting ANY admin in that company.
      // Easiest is to set adminId to a company lead. We'll find a 'lead' or 'admin' user in that company.
      const companyId = story.companyId;
      const user = await mongoose.connection.collection('users').findOne({ companyId, role: { $in: ['admin', 'superadmin', 'lead'] } });
      
      if (user) {
        story.adminId = user._id;
        await story.save();
        console.log(`Updated story ${story._id} with adminId ${user._id}`);
      } else {
        console.log(`No valid admin found for story ${story._id}`);
      }
    }
  }

  process.exit(0);
}

fix().catch(console.error);
