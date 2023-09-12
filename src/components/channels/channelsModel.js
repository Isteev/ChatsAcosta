import { DataTypes } from "sequelize";
import { sequelizeConn } from "../../config/sequalize.js";
import { ColaboratorModel } from "../colaborator/colaboratorsModel.js";

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
        user_email: {
            type: DataTypes.STRING,
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

ColaboratorModel.hasMany(ChannelModel, {foreignKey: "colaborator_id", sourceKey: "id"});

ChannelModel.belongsTo(ColaboratorModel, {
    foreignKey: "colaborator_id",
    sourceKey: "id",
});