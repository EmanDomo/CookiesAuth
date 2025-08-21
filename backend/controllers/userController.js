import userModel from '../models/userModel.js';
import otpModel from '../models/otpModel.js';
import nodemailer from '../services/nodemailer.js';

const userController = {

    async serviceProviderSendOTP(req, res) {
        try {
            const { email } = req.body;

            // 1. Validate email presence
            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }

            // 2. Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: "Invalid email format" });
            }
            // 5. Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 5 * 60000);

            // 6. Save OTP 
            await otpModel.generate(email, otp, expiresAt);

            // 7. Send Email
            await nodemailer.sendEmail(email, 'Your OTP Code', `Your OTP is ${otp}`);

            res.json({ message: 'OTP sent to email' });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async providerVerifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    // 1. Validate input
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // 2. Verify OTP using your model
    const isValid = await otpModel.verify(email, otp);

    // 3. Send response
    if (isValid) {
      return res.json({ valid: true, message: "OTP verified successfully" });
    } else {
      return res.json({ valid: false, message: "Invalid or expired OTP" });
    }

  } catch (err) {
    console.error("Error in verifyOTP controller:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
},


    async registerServiceProvider(req, res) {
        try {
            const { first_name, last_name, email, phone, username, password, role, is_verified } = req.body;

                        const isOtpValid = await otpModel.verify(email, otp);

             if (!isOtpValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

            const existingUser = await userModel.findByUserName(username);

            if (existingUser) {
                return res.status(404).json({ message: "User already exists" });
            }

            const newUser = await userModel.registerServiceProvider(
                first_name, last_name, email, phone, username, password, role, is_verified
            );



    if (!isOtpValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

            res.status(200).json({ message: "User has been created", user: newUser });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server Error" });
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await userModel.getAllUsers();
            res.status(200).json({ message: "Select all user success", users });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "Server Error" });
        }
    },

    async getAllUsersForAdmin(req, res) {
        try {
            const users = await userModel.getAllUsers();
            res.status(200).json({ message: "Select all user success", users });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "Server Error" });
        }
    },

    async userLogin(req, res) {
        try {
            const { username, password, role } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: "Username and password are required" });
            }

            const users = await userModel.userLogin(username, password, role);

            if (users.length === 0) {
                return res.status(401).json({ message: "Invalid username or password" });
            }

            const user = users[0];
            const { password: _, ...userWithoutPassword } = user;

            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            };

            console.log('Session ID:', req.sessionID);
            console.log('Session data after login:', req.session);
            console.log('Session user:', req.session.user);

            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: userWithoutPassword,
                debug: {
                    sessionId: req.sessionID,
                    hasSession: !!req.session.user
                }
            });
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ message: "Server Error" });
        }
    },

    logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: "Failed to log out" });
            }
            res.clearCookie("connect.sid");
            return res.json({ message: "Logged out successfully" });
        });
    }
};

export default userController;
