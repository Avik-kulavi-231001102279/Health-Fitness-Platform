const mongoose = require('mongoose');
const dns = require('dns');

// Ensure Node uses reliable public DNS for MongoDB Atlas SRV lookup (fixes querySrv ECONNREFUSED on Windows/ISPs)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setServers is restricted
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;