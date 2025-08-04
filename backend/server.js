// import express from 'express';
// import db from './config/db.js';
// const app = express();
// const port = 3000;
// import userRoutes from './routes/userRoutes.js';
// import cors from 'cors';
// import session from 'express-session';
// import bcrypt from 'bcrypt';

// app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     rolling: true, // <-- reset expiration time on each request
//     cookie: {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 1000 * 60 * 60
//     }
//   })
// );



// app.use('/api/user', userRoutes);

// app.listen(port, () => {
//     console.log(`Express app listening at http://localhost:${port}`);
// });

// db.getConnection()
//     .then(connection => {
//         console.log('Connected to MySQL Database!');
//         connection.release();
//     })
//     .catch(err => {
//         console.error('Error connecting to MySQL:', err.message);
//     });



import express from 'express';
import db from './config/db.js'; // <-- pg.Pool connection
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import session from 'express-session';
import bcrypt from 'bcrypt';

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173',
  'https://subtle-druid-d9a1cf.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true, // reset expiration time on each request
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 // 1 hour
    }
  })
);

app.use('/api/user', userRoutes);

app.listen(port, async () => {
  console.log(`Express app listening at http://localhost:${port}`);
  
  try {
    const client = await db.connect();
    console.log('Connected to PostgreSQL Database!');
    client.release();
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
  }
});
