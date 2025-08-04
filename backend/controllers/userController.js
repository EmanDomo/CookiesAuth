import User from '../models/userModel.js';

const userController = {

    createUser: async (req, res) => {
        try {

            const {userName, userAge, password} = req.body;

            const existingUser = await User.findByUserName(userName);

            if (existingUser) {
                return res.status(404).json({message: "user already exist"})
            }

            const newUser = await User.createUser(userName, userAge, password)

            res.status(200).json({message: "user has been created", user: newUser});

        } catch (err) {
            console.log(err.message);
            res.status(500).json({message: "Server Error"})
        }
    },

    getAllUsers: async (req, res) => {
        try {

            const users = await User.getAllUsers();


            res.status(200).json({message: "Select all user success", users});

        } catch (err) {
            console.log(err.message);
            res.status(500).json({message: "Server Error"})
        }
    },

    getAllUsersForAdmin: async (req, res) => {
        try {

            const users = await User.getAllUsers();


            res.status(200).json({message: "Select all user success", users});

        } catch (err) {
            console.log(err.message);
            res.status(500).json({message: "Server Error"})
        }
    },

userLogin: async (req, res) => {
    try {
        const { userName, password, role } = req.body;
        
        if (!userName || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const users = await User.userLogin(userName, password, role);

        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const user = users[0];
        const { password: _, ...userWithoutPassword } = user;

        req.session.user = { 
            id: user.userID, 
            username: user.userName,
            role: user.role
        };
        
        // 🔍 DEBUG: Check if session is created
        console.log('Session ID:', req.sessionID);
        console.log('Session data after login:', req.session);
        console.log('Session user:', req.session.user);
        
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: userWithoutPassword,
            // 🔍 DEBUG: Send session info back
            debug: {
                sessionId: req.sessionID,
                hasSession: !!req.session.user
            }
        });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Server Error" });
    }
},

logout: (req, res) => {
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