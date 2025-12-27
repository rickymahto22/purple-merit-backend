import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

// Define what a User looks like
class User extends Model {
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: 'owner' | 'collaborator' | 'viewer';
}

// Initialize the table structure
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generate a unique ID
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('owner', 'collaborator', 'viewer'),
      defaultValue: 'viewer',
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);

export default User;