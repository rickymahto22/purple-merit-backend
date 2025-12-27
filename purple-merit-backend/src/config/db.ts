import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Create the connection to the database
export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  logging: false, // Set to true if you want to see every SQL query in the terminal
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected Successfully.');
    
    // This creates the tables in the database automatically
    await sequelize.sync({ alter: true });
    console.log('✅ Database Tables Synced.');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
};