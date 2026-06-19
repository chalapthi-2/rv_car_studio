const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://Chalapathi-babu:Cherry%402004@cluster0.uvld9d2.mongodb.net/?appName=Cluster0'
)
.then(() => {
  console.log('Connected');
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});