import { DataTypes } from "sequelize";
import { sequelizeConn } from "../../config/sequalize.js";
import { CompanyModel } from "../company/companyModel.js";

export const ColaboratorModel = sequelizeConn.define(
    "colaborator",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        active: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
        },
        email: {
            type: DataTypes.STRING,
            defaultValue: 1,
        },
        phone: {
            type: DataTypes.INTEGER,
        },
        document: {
            type: DataTypes.STRING,
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

CompanyModel.hasMany(ColaboratorModel, {
    foreignKey: "company_id",
    sourceKey: "id",
});

ColaboratorModel.belongsTo(CompanyModel, {
    foreignKey: "company_id",
    targetKey: "id",
});

