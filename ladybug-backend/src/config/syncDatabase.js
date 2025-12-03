import sequelize, { testConnection } from './database.js';

import '../models/associations.js'

console.log('Script started!');

const syncDatabase = async () => {
  try {
    console.log('Testing database connection...');
    
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }

    console.log('\nSynchronizing database models...');
    
    await sequelize.sync({ alter: true });
    
    console.log('Database synchronized successfully!');
    console.log('\nAll tables created/updated in PostgreSQL');
    
    process.exit(0);
  } catch (error) {
    console.error('Database synchronization failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

syncDatabase();