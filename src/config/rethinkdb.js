import rethinkdb from "rethinkdb";

// database connection
let rdbConn = null;
const rdbConnect = async function () {
    try {
        const conn = await rethinkdb.connect({
            // host: process.env.RETHINKDB_HOST || "localhost",
            host: process.env.RETHINKDB_HOST,
            port: process.env.RETHINKDB_PORT || 28015,
            username: process.env.RETHINKDB_USERNAME || "admin",
            password: process.env.RETHINKDB_PASSWORD || "",
            db: process.env.RETHINKDB_NAME,
        });

        // Handle close
        conn.on("close", function (e) {
            console.log("RDB connection closed: ", e);
            rdbConn = null;
        });

        rdbConn = conn;
        return conn;
    } catch (err) {
        throw err;
    }
};

const getRethinkDB = async function () {
    if (rdbConn != null) {
        return rdbConn;
    }
    return await rdbConnect();
};

export default getRethinkDB;
