import { DataTypes } from "sequelize";
import { sequelizeConn } from "../../config/sequalize.js";

export const CompanyModel = sequelizeConn.define(
    "company",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
        },
        active: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
    },
    {
        initialAutoIncrement: 100,
        freezeTableName: false,
    }
);
