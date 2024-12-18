import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors'; // Không cần gọi lại require cho cors
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import { app, server } from'../backend/socket/index.js';
import util from 'util';
import connectDB from './config/connectDB.js';
import 'dotenv/config';
import UserModel from '../backend/Models/UserModel.js';
// const app = express(); // Chuyển app lên trên

// Cấu hình CORS với tùy chọn chính xác
const corsOptions = {
  origin: 'http://localhost:3000',  // Chỉ cho phép các yêu cầu từ nguồn gốc này
  credentials: true,  // Cho phép gửi cookie và thông tin xác thực
};

app.use(cors(corsOptions)); // Sử dụng cấu hình CORS

const port = 3300;
const saltRounds = 10;

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());
app.use(express.json()); 
app.use(cors({
  origin: ["http://localhost:3000"],
  methods:["POST","GET"],
  credentials: true,

}))
app.use(cookieParser());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'signup',
});

connectDB();

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not valid" });
      } else {
        req.name = decoded.name;
        req.role = decoded.role; // Add role to request object
        next();
      }
    });
  }
}
app.get('/page',verifyUser,(req, res) => {
  return res.json({Status:"Success",role: req.role});
})
 // Load biến môi trường từ .env

 // Load biến môi trường từ .env

const jwtSecret = process.env.JWT_SECRET; // Lấy chuỗi bí mật từ biến môi trường
const query = util.promisify(db.query).bind(db);
app.post('/register', async (req, res) => {
  const { fullname, email, password } = req.body;

  // Validate user inputs
  if (!fullname || !email || !password) {
    return res.status(400).json({ Error: "All fields are required" });
  }

  try {
    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);

    // Save the user in MySQL
    const sql = "INSERT INTO login (`fullname`, `email`, `password`, `role`) VALUES (?, ?, ?, ?)";
    const values = [fullname, email, hash, 'user'];

    // Execute the MySQL query
    const results = await query(sql, values);
    const userId = results.insertId; // ID of the newly registered user in MySQL

    // Create a JWT token
    const tokenPayload = { id: userId.toString(), email }; // Use `userId` and `email` from inputs
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Save user in MongoDB (without the password)
    const mongoUser = new UserModel({
      fullname,
      email,
      profile_pic: "", // Default profile picture in MongoDB
      mysql_id: userId, // Store the MySQL ID to relate MongoDB data with MySQL
    });

    await mongoUser.save();

    // Return success response
    return res.status(201).json({
      Status: "User registered successfully",
      token: token,
      user: { id: userId, fullname, email },
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ Error: "Server error during registration." });
  }
});




app.post('/login', (req, res) => {
  const sql = 'SELECT * FROM login WHERE email = ?';
  
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Login error in server" });
    if (data.length > 0) {
      bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
        if (err) return res.json({ Error: "Password compare error" });
        if (response) {
          const name = data[0].name;
          const role = data[0].role; // Get the user's role
          const token = jwt.sign({ name, role }, "jwt-secret-key", { expiresIn: '1d' });

          res.cookie('token', token);
          return res.json({ Status: "Success",  role }); // Send role to client as well
        } else {
          return res.json({ Error: "Password is incorrect" });
        }
      });
    } else {
      return res.json({ Error: "No email existed" });
    }
  });
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the MySQL database.');
});
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({Status:"Success"});

})

app.get('/admin', verifyUser, (req, res) => {
  if (req.role !== 'admin') {
    return res.json({ Error: "Access denied, not an admin" });
  }
  return res.json({ Status: "Success", message: "Welcome admin!" });
});

app.get('/user', verifyUser, (req, res) => {
  if (req.role !== 'user') {
    return res.json({ Error: "Access denied, not a regular user" });
  }
  return res.json({ Status: "Success", message: "Welcome user!" });
});



// app.get('/api/data', (req, res) => {
//   const sql = 'SELECT * FROM login'; // Thay đổi với tên bảng của bạn
//   db.query(sql, (err, result) => {
//       if (err) {
//           return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
//       }

//       // Chuyển đổi kết quả truy vấn thành JSON và ghi vào file db.json
//       fs.writeFile('data.json', JSON.stringify(result, null, 2), (err) => {
//           if (err) {
//               return res.status(500).json({ error: 'Lỗi ghi file' });
//           }

//           // Trả về thông báo thành công
//           res.json({ message: 'Dữ liệu đã được ghi vào db.json', data: result });
//       });
//   });
// });

import fileUpload from 'express-fileupload'
const uploadOpts = {
  useTempFiles : true,
  tempFileDir: '/tmp/'
}
import XLSX from 'xlsx';
app.post('/api/upload', fileUpload(uploadOpts), (req, res) => {
  try {
    const { excel } = req.files;
    if (excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      fs.unlinkSync(excel.tempFilePath);
      return res.status(400).json({ msg: 'File is invalid' });
    }

    const workbook = XLSX.readFile(excel.tempFilePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Initialize successData and failureData arrays
    const successData = [];
    const failureData = [];

    // Process all rows asynchronously
    const promises = data.map((row, index) => {
      const { Number, StudentID, Name, Class } = row;
      const sql = 'INSERT INTO students (Number, StudentID, Name, Class) VALUES (?, ?, ?, ?)';

      return new Promise((resolve, reject) => {
        db.query(sql, [Number, StudentID, Name, Class], (err, result) => {
          if (err) {
            failureData.push(row); // Push to failureData if error
            reject(err);
          } else {
            successData.push(row); // Push to successData if successful
            resolve(result);
          }
        });
      });
    });

    // Wait for all database operations to finish
    Promise.allSettled(promises).then(() => {
      fs.unlinkSync(excel.tempFilePath); // Delete temp file after processing

      const responseData = { successData, failureData };
      fs.writeFile('db.json', JSON.stringify(responseData, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error writing to file' });
        }

        return res.json({ msg: 'DONE', data: responseData });
      });
    }).catch(error => {
      console.error(error);
      return res.status(500).json({ msg: 'Server error during database operations' });
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});




// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
