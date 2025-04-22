import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize } from '../config/db'
import User from './User'

interface TaskAttributes {
    id: number
    title: string
    start: Date
    end: Date
    details?: string
    userId: number // 👈 novo campo
    createdAt?: Date
    updatedAt?: Date
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: number
    public title!: string
    public start!: Date
    public end!: Date
    public details?: string
    public userId!: number
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        start: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end: {
            type: DataTypes.DATE,
            allowNull: false
        },
        details: {
            type: DataTypes.TEXT
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' }
        }
    },
    {
        sequelize,
        modelName: 'Task',
        tableName: 'tasks'
    }
)

Task.belongsTo(User, { foreignKey: 'userId', as: 'user' }) // Relação

export default Task

