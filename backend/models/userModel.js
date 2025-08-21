
import db from '../config/db.js';

const userModel = {

    async findByUserName(username) {
        try {
            const result = await db.query(
                'SELECT * FROM tbl_users WHERE username = $1',
                [username]
            );
            return result.rows[0];
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    },

    async registerServiceProvider(first_name, last_name, email, phone, username, password, role, is_verified) {
        try {
            await db.query(
                'INSERT INTO tbl_users (first_name, last_name, email, phone, username, password, role, is_verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [first_name, last_name, email, phone, username, password, role || 'service_provider', is_verified]
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

    async userLogin(username, password) {
        try {
            const result = await db.query(
                'SELECT * FROM tbl_users WHERE username = $1 AND password = $2',
                [username, password]
            );
            return result.rows;
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    }

};

export default userModel;
