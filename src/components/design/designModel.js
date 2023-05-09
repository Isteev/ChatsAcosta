import { DataTypes } from "sequelize";
import { sequelizeConn } from "../../config/sequalize.js";
import { CompanyModel } from "../company/companyModel.js";

export const DesignModel = sequelizeConn.define(
    "design",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        send_color: {
            type: DataTypes.STRING,
            defaultValue: "#36b69e",
        },
        receive_color: {
            type: DataTypes.STRING,
            defaultValue: "#BEC2CE",
        },
        send_text_color: {
            type: DataTypes.STRING,
            defaultValue: "#ffffff",
        },
        receive_text_color: {
            type: DataTypes.STRING,
            defaultValue: "#ffffff",
        },
        app_bar_color: {
            type: DataTypes.STRING,
            defaultValue: "#FF3142",
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

CompanyModel.hasOne(DesignModel, {
    foreignKey: "company_id",
    sourceKey: "id",
});

DesignModel.belongsTo(CompanyModel, {
    foreignKey: "company_id",
    sourceKey: "id",
});
