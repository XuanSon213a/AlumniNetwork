import React from 'react';
import Avatar from '../../AluminiList/Avatar';
import { Link } from 'react-router-dom';

interface UserSearchCardProps {
  userId: string; // ID của người dùng dưới dạng chuỗi
  name: string;
  email?: string;
  profile_pic?: string;
  onClose: () => void;
}

const UserSearchCard: React.FC<UserSearchCardProps> = ({ userId, name, email, profile_pic, onClose }) => {
  return (
    <Link
      to={`/${userId}`}
      onClick={onClose}
      className="flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border hover:border-primary rounded cursor-pointer"
    >
      <div>
        <Avatar
          width={50}
          height={50}
          fullname={name}
          userId={userId}
          imageUrl={profile_pic}
        />
      </div>
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">
          {name}
        </div>
        {email && <p className="text-sm text-ellipsis line-clamp-1">{email}</p>}
      </div>
    </Link>
  );
};

export default UserSearchCard;
