import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id:"",
    fullname:"",
    email: "",
    role:"",
    profile_pic: "",
    
    token: "",
    selectedUser: null,
    onlineUser : [],
    socketConnection : null
  },
  reducers: {
   setUser : (state,action)=>{
        state.id = action.payload.id
        state.fullname = action.payload.fullname
        state.email = action.payload.email
        state.role = action.payload.role
        state.profile_pic = action.payload.profile_pic
        state.socketConnection = null;
   } ,
   setToken : (state,action)=>{
        state.token = action.payload
   },
   logout: (state) => {
    state.id = "";
    state.fullname = "";
    state.email = "";
    state.role = "";
    state.profile_pic = "";
    state.token = "";
    state.socketConnection = null;
  },
  
   setSelectedUser: (state, action) => {
     state.selectedUser = action.payload;
   },
   // Xóa người dùng được chọn
   clearSelectedUser: (state) => {
     state.selectedUser = null;
   },
   setOnlineUser : (state,action)=>{
     state.onlineUser = action.payload
   },
   setSocketConnection : (state,action)=>{
     state.socketConnection = action.payload
   },

},})

// Action creators are generated for each case reducer function
export const { setUser, setToken,logout,setSelectedUser, clearSelectedUser,setOnlineUser,setSocketConnection } = userSlice.actions

export default userSlice.reducer