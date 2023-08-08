import { Sequelize } from "sequelize";

export const sequelizeConn = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        dialectOptions: {
            timezone: "+00:00"
        }
    },
);
