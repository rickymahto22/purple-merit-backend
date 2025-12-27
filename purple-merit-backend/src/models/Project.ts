import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import User from './User';

class Project extends Model {
  public id!: string;
  public name!: string;
  public ownerId!: string;
  public description!: string;
}

Project.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    ownerId: { type: DataTypes.UUID, allowNull: false },
  },
  { sequelize, tableName: 'projects' }
);
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
export default Project;