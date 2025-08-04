// 

import db from '../config/db.js';

const userModel = {

    async findByUserName(userName) {
        try {
            const result = await db.query(
                'SELECT * FROM tbl_users WHERE "userName" = $1',
                [userName]
            );
            return result.rows[0];
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    },

    async createUser(userName, userAge, password, role) {
        try {
            await db.query(
                'INSERT INTO tbl_users ("userName", "userAge", "password", "role") VALUES ($1, $2, $3, $4)',
                [userName, userAge, password, role || 'user']
            );
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    },

    async getAllUsers() {
        try {
            const result = await db.query('SELECT * FROM tbl_users');
            return result.rows;
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    },

    async getAllUsersForAdmin() {
        try {
            const result = await db.query('SELECT * FROM tbl_users');
            return result.rows;
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    },

    async userLogin(userName, password) {
        try {
            const result = await db.query(
                'SELECT * FROM tbl_users WHERE "userName" = $1 AND "password" = $2',
                [userName, password]
            );
            return result.rows;
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    }

};

export default userModel;
