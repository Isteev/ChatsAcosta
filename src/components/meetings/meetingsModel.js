import { DataTypes } from "sequelize";
import { sequelizeConn } from "../../config/sequalize.js";
import { CompanyModel } from "../company/companyModel.js";
import { ChannelModel } from "../channels/channelsModel.js";

export const MeetignsModel = sequelizeConn.define(
    "meetign",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        active: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
        },
    },
    {
        initialAutoIncrement: 100,
        freezeTableName: false,
    }
);

CompanyModel.hasOne(MeetignsModel, {
    foreignKey: "company_id",
    sourceKey: "id",
});

MeetignsModel.belongsTo(CompanyModel, {
    foreignKey: "company_id",
    sourceKey: "id",
});

ChannelModel.hasMany(MeetignsModel, {
    foreignKey: "channel_id",
    sourceKey: "id",
});

MeetignsModel.belongsTo(ChannelModel, {
    foreignKey: "channel_id",
    sourceKey: "id",
});
