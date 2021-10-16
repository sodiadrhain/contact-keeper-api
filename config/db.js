const mongoose = require('mongoose');
const config = require('config');

const connect = async () => {
  try {
    await mongoose.connect(config.get('mongodbUrl'), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connect;
