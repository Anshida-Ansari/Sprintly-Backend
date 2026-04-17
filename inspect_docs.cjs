const mongoose = require('mongoose');

async function inspectDoc() {
  await mongoose.connect('mongodb://localhost:27017/sprintly');
  const subtasks = await mongoose.connection.db.collection('subtasks').find({}).limit(1).toArray();
  const worklogs = await mongoose.connection.db.collection('worklogs').find({}).limit(1).toArray();
  console.log('Subtask Sample:', JSON.stringify(subtasks[0], null, 2));
  console.log('Worklog Sample:', JSON.stringify(worklogs[0], null, 2));
  process.exit(0);
}

inspectDoc().catch(err => {
  console.error(err);
  process.exit(1);
});
