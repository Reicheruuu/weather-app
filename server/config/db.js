const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = "mongodb+srv://pauljericho1:hc7141A9lkIoa1D4@cluster0.oibokdw.mongodb.net/weatherapp?retryWrites=true&w=majority";
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas Connected!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;


// localhost
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect('mongodb://localhost:27017/weatherapp', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
