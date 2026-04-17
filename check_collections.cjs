const mongoose = require('mongoose');

async function checkCollections() {
  await mongoose.connect('mongodb://localhost:27017/sprintly'); // Adjust URI if needed
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  process.exit(0);
}

checkCollections().catch(err => {
  console.error(err);
  process.exit(1);
});
