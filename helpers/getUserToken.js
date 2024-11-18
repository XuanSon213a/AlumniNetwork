import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import UserModel from '../Models/UserModel.js';



const getUserToken = async (token) => {
  if (!token) {
    return { message: 'Session expired. Please log in again.', logout: true };
  }

  try {
    // Xác thực token JWT
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decode);

    // Kiểm tra và chuyển đổi id sang ObjectId
    if (!mongoose.Types.ObjectId.isValid(decode.id)) {
      throw new Error('Invalid ObjectId');
    }
    const userId = new mongoose.Types.ObjectId(decode.id);

    // Tìm người dùng trong MongoDB
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return { message: 'User not found. Please log in again.', logout: true };
    }

    return user;
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return { message: 'Invalid or expired token. Please log in again.', logout: true };
  }
};


export default getUserToken;
