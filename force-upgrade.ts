import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
	console.error("MONGO_URI is not defined in environment variables!");
	process.exit(1);
}

/**
 * Force upgrades all companies to the "Pro" plan.
 * This is used to resolve issues where companies are stuck on lower plans.
 */
async function forceUpgrade() {
	try {
		console.log("Connecting to database...");
		await mongoose.connect(MONGO_URI as string);

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection could not be established.");
		}

		// 1. Find any plan that looks like "Pro"
		console.log("Searching for Pro plan...");
		const proPlan = await db.collection("subscriptionplans").findOne({
			name: { $regex: /pro/i },
		});

		if (!proPlan) {
			console.error("Pro plan not found in DB! Please run seed-plans first.");
			process.exit(1);
		}

		console.log(
			`Found plan: "${proPlan.name}" with project limit: ${proPlan.projectLimit}`,
		);

		// 2. Update all companies to this plan
		console.log("Updating all companies...");
		const result = await db.collection("companies").updateMany(
			{},
			{
				$set: {
					currentPlan: proPlan.name,
					projectLimit: proPlan.projectLimit,
				},
			},
		);

		console.log(`Successfully updated ${result.modifiedCount} companies.`);
		process.exit(0);
	} catch (error) {
		console.error("An error occurred during the force upgrade process:");
		console.error(error instanceof Error ? error.message : error);
		process.exit(1);
	} finally {
		// Ensure the connection is closed even if an error occurs
		await mongoose.disconnect();
	}
}

// Execute the force upgrade
forceUpgrade();
