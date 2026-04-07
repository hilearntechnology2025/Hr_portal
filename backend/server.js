require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const seedAdmin = require("./src/config/seedAdmin");  

const start = async () => {
  await connectDB();      // first connect to DB
  await seedAdmin();      // then check/create admin

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
  });
};

start();