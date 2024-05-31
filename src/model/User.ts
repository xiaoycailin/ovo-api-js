import pool from "../database/connection"
import ResponseError from "../error/ResponseError";
import { DatabaseQueryResponse } from "../interface";
import { ResponseCode } from "../interface/Enum";
import { UserData, UserQuery } from "../interface/User"

export default class ovo_user {
    static async find(query?: UserQuery) {
        const connection = await pool.getConnection()
        try {
            let queryString = "SELECT * FROM ovo_users";
            const queryParams: any[] = [];
            if (query?.where) {
                const whereClauses = Object.entries(query.where).map(([key, value]) => {
                    queryParams.push(value)
                    return `${key} = ?`
                })
                if (whereClauses.length > 0) {
                    queryString += " WHERE " + whereClauses.join(" AND ")
                }
            }
            const user = await connection.query(queryString, queryParams)
            const user0: any = user[0]
            if (user0.length === 0) throw new ResponseError(ResponseCode.NOT_FOUND, 'No User Found')
            return user0 as UserData[]
        } finally {
            connection.release()
        }
    }
    
    static async findOne(query?: UserQuery) {
        const connection = await pool.getConnection()
        try {
            let queryString = "SELECT * FROM ovo_users";
            const queryParams: any[] = [];
            if (query?.where) {
                const whereClauses = Object.entries(query?.where).map(([key, value]) => {
                    queryParams.push(value);
                    return `${key} = ?`;
                });
                if (whereClauses.length > 0) {
                    queryString += " WHERE " + whereClauses.join(" AND ");
                }
            }
            const user = await connection.query(queryString, queryParams);
            const user0: any = user[0];
            if (user0.length === 0) throw new ResponseError(ResponseCode.NOT_FOUND, 'No User Found');
            return user0[0] as UserData;
        } finally {
            connection.release();
        }
    }

    static async create(userData: UserQuery['create']) {
        const connection = await pool.getConnection()
        try {
            if (userData) {
                let results = [];
                const insertData = Array.isArray(userData) ? userData : [userData];
                const allQueryParams: any[] = [];
                let queryString = "INSERT INTO ovo_users (";

                if (insertData.length > 0) {
                    const keys = Object.keys(insertData[0]).filter(key => ['username', 'apikey', 'phone_number', 'access_token', 'pin'].includes(key));
                    queryString += keys.join(', ') + ") VALUES ";
                    insertData.forEach((data, index) => {
                        const placeholders = keys.map(() => '?').join(', ');
                        queryString += (index > 0 ? ", " : "") + `(${placeholders})`;
                        const queryParams = keys.map(key => data[key]);
                        allQueryParams.push(...queryParams);
                    });
                }

                const result = await connection.query(queryString, allQueryParams);
                results.push(result);
                const response: DatabaseQueryResponse = results[0][0] as any
                if (response) return response
                throw new Error('No data created')
            }
        } finally {
            connection.release();
        }
    }

    static async update(query: UserQuery) {
        const connection = await pool.getConnection();
        try {
            if (query.update && query.where) {

                let queryString = "UPDATE ovo_users SET ";
                const updateKeys = Object.keys(query.update as UserData) as (keyof UserData)[];
                const updateValues = updateKeys.map(key => query.update![key]);
                const setClauses = updateKeys.map(key => `${key} = ?`).join(', ');

                queryString += setClauses;

                const whereKeys = Object.keys(query.where);
                const whereValues = whereKeys.map(key => query.where![key]);
                const whereClauses = whereKeys.map(key => `${key} = ?`).join(' AND ');

                if (whereClauses.length > 0) {
                    queryString += " WHERE " + whereClauses;
                }

                const queryParams = [...updateValues, ...whereValues];
                const result = await connection.query(queryString, queryParams);
                const affectedRows = (result as DatabaseQueryResponse).affectedRows;

                if (affectedRows === 0) {
                    throw new ResponseError(ResponseCode.NOT_FOUND, 'Tidak ada Pengguna yang diperbarui');
                }

                return { message: 'Pengguna berhasil diperbarui', affectedRows };
            } else {
                throw new ResponseError(ResponseCode.BAD_REQUEST, 'Data pembaruan atau kondisi tidak valid');
            }
        } finally {
            connection.release();
        }
    }
}