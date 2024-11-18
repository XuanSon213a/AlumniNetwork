import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Import userReducer từ file userSlice.ts

// Tạo store và kết hợp với reducer từ userSlice
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Tạo các type hỗ trợ cho TypeScript
export type RootState = ReturnType<typeof store.getState>; // Dùng để lấy type cho state trong useSelector
export type AppDispatch = typeof store.dispatch; // Dùng để dispatch actions

export default store;
