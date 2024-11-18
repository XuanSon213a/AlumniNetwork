import React, { ChangeEvent, useState } from 'react'
import Avatar from '../../AluminiList/Avatar';
import { useDispatch } from 'react-redux';


interface User {
  id: string;
  fullname: string;
  email: string;
  role: string;
  profile_pic: string;
  token: string;
  selectedUser: null;
}

// Define the Props type for EditUserDetails
interface EditUserDetailProps {
  onClose: () => void;
  loggedInUser: User;
}

const EditUserDetail: React.FC<EditUserDetailProps> = ({ onClose, loggedInUser }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState<User>(loggedInUser);


  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
      <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
        <h2 className='font-semibold'>Profile Details</h2>
        <p className='text-sm'>Edit user details</p>
        <form className='grid gap-3 mt-3' >
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              name='name'
              id='name'
              value={data.fullname}
              onChange={handleOnChange}
              className='w-full py-1 px-2 focus:outline-primary border-0.5'
            />
          </div>
          <div>
            <div>Photo:</div>
            <div className='my-1 flex items-center gap-4'>
              <Avatar width={40} height={40} imageUrl={data.profile_pic} fullname={data.fullname} userId={''} />
              <button className='font-semibold'> 
                Change Photo
              </button>
              <input
                type='file'
                // ref={uploadPhotoRef}
                className='hidden'
                // onChange={handleUploadPhoto}
              />
            </div>
          </div>
          {/* <Divider /> */}
          <div className='flex gap-2 w-fit ml-auto'>
            <button
              onClick={onClose}
              className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetail