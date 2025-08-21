import db from '../config/db.js';

const OtpModel = {
    async generate(email, otp, expiresAt) {
        try {
            //checks if the user requested an OTP too recently (e.g., within 1 minute)
            const cooldown = await db.query(
                `SELECT * 
             FROM tbl_otp 
             WHERE email = $1 
               AND requested_at > NOW() - INTERVAL '1 minute'`,
                [email]
            );

            if (cooldown.rows.length > 0) {
                throw new Error("Please wait before requesting another OTP.");
            }

            //replace existing OTP instead of inserting new row
            await db.query(
                `INSERT INTO tbl_otp (email, otp, expires_at, requested_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (email) 
             DO UPDATE SET otp = EXCLUDED.otp,
                           expires_at = EXCLUDED.expires_at,
                           requested_at = NOW()`,
                [email, otp, expiresAt]
            );

        } catch (err) {
            console.error('Error saving OTP:', err.message);
            throw err;
        }
    },


    async verify(email, otp) {
        try {
            const result = await db.query(
                'SELECT * FROM tbl_otp WHERE email = $1 AND otp = $2 AND expires_at > NOW()',
                [email, otp]
            );
            return result.rows.length > 0;
        } catch (err) {
            console.error('Error verifying OTP:', err.message);
            throw err;
        }
    }
};

export default OtpModel;
