const mongoose = require("mongoose");
const uri =
	"mongodb+srv://anshidapansari_db_user:ZMY7Euiwv1APeEAh@cluster0.bj3fiho.mongodb.net/sprintly?retryWrites=true&w=majority";
const stripePriceId = "price_1TLmEXF7vhBBxTD2tPyXV0re";

mongoose
	.connect(uri)
	.then(async () => {
		const db = mongoose.connection.db;
		const collection = db.collection("subscriptionplans");

		// Clear existing (if any)
		await collection.deleteMany({});

		const plans = [
			{
				name: "Free Plan",
				price: 0,
				projectLimit: 2,
				stripePriceId: null,
				features: [
					{ text: "Up to 2 projects", included: true },
					{ text: "Basic reports", included: true },
					{ text: "Core features", included: true },
					{ text: "Priority support", included: false },
				],
				isActive: true,
				isPopular: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "Pro Plan",
				price: 999,
				projectLimit: -1,
				stripePriceId: stripePriceId,
				features: [
					{ text: "Unlimited projects", included: true },
					{ text: "Advanced analytics", included: true },
					{ text: "AI insights", included: true },
					{ text: "Priority support", included: true },
				],
				isActive: true,
				isPopular: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		const result = await collection.insertMany(plans);
		console.log("Seeded plans:", result.insertedCount);
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
