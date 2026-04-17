const mongoose = require('mongoose');

async function inspectDoc() {
  await mongoose.connect('mongodb://localhost:27017/sprintly');
  const stories = await mongoose.connection.db.collection('userstories').find({}).limit(1).toArray();
  console.log('UserStory Sample:', JSON.stringify(stories[0], null, 2));
  process.exit(0);
}

inspectDoc().catch(err => {
  console.error(err);
  process.exit(1);
});
