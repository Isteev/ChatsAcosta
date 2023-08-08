import { DataTypes } from "sequelize";
import { sequelizeConn } from "../../config/sequalize.js";
import { ChannelModel } from "../channels/channelsModel.js";

export const MessagesModel = sequelizeConn.define(
    "messages",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("text", "image", "file"),
            allowNull: false,
            defaultValue: "text",
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        colaborator_id: {
            type: DataTypes.INTEGER,
            allowNull: null,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        channel_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        meeting_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        message_status: {
            type: DataTypes.ENUM("save", "received", "read"),
            defaultValue: "save",
        },
        message_user_type: {
            type: DataTypes.ENUM("user", "colaborator"),
            defaultValue: "user",
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
        },
    },
    {
        initialAutoIncrement: 100,
        freezeTableName: true,
    }
);


ChannelModel.hasMany(MessagesModel, {as: "messages", foreignKey: "channel_id"});

MessagesModel.belongsTo(ChannelModel, {
    foreignKey: "company_id",
    sourceKey: "id",
});
