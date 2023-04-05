import { DataTypes } from "sequelize";
import { sequelizeConn } from "../../config/sequalize.js";

export const ChannelModel = sequelizeConn.define(
    "channel",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        colaborator_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
        },
    },
    {
        initialAutoIncrement: 100,
        freezeTableName: false,
    }
);
