"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = require("mysql2");
try {
    const connection = (0, mysql2_1.createConnection)({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'), // Default ke 3306 jika DB_PORT tidak didefinisikan
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_STORE
    });
    const createTableSQL = `
    ALTER TABLE ovo_users
    ADD otp_token LONGTEXT;
    `;
    connection.query(createTableSQL, (error, results, fields) => {
        if (error) {
            return console.error('Error saat membuat tabel: ', error);
        }
        console.log('Tabel berhasil dibuat');
    });
    connection.end();
}
catch (error) {
    console.log(error);
}
