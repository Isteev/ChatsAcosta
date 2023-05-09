import { DataTypes } from "sequelize";
import { sequelizeConn } from "../../config/sequalize.js";

export const UserModel = sequelizeConn.define(
    "user",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        initialAutoIncrement: 100,
        freezeTableName: false,
    }
);

export default UserModel;
