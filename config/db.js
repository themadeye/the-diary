const mongoose = require('mongoose');
const connectDB = async () => {
     try{
          const cn = await mongoose.connect(process.env.MONGO_URI, {
               useNewUrlParser: true,
               useUnifiedTopology: true,
               useFindAndModify: false
          });
          console.log(`Mongodb connected: ${cn.connection.host}`);
     }catch(err){
          console.log(err.message);
          // If error on connecting databaase, should stop the process, stop everything.
          process.exit(1);
     }
}

module.exports = connectDB;