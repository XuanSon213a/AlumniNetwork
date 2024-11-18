import React, { useState, useEffect } from 'react';
import { IoSearchOutline, IoClose } from "react-icons/io5";
import UserSearchCard from '../../Message/Theme/UserSearchCard';
import { useSelector } from 'react-redux';

interface StudentData {
  "Student ID": string;
  Name: string;
  Class: string;
  profile_pic?: string;
}

interface SearchUserProps {
  onClose: () => void;
  students: StudentData[];
}

const SearchUser: React.FC<SearchUserProps> = ({ onClose, students }) => {
  const [search, setSearch] = useState<string>(""); // Từ khóa tìm kiếm
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]); // Kết quả tìm kiếm

  // Lấy danh sách người dùng online từ Redux
  const onlineUser = useSelector((state: any) => state.user.onlineUser);

  useEffect(() => {
    console.log("All students:", students);

    if (search.trim() !== "") {
      const searchLower = search.toLowerCase().trim(); // Xử lý chuỗi tìm kiếm

      // Filter students based on search input
      const filtered = students.filter((student) => {
        const studentName = student.Name.toLowerCase().trim();
        return studentName.includes(searchLower);
      });

      setFilteredStudents(filtered);
      console.log("Filtered students:", filtered); // Log filtered results
    } else {
      setFilteredStudents([]);
    }
  }, [search, students]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10 bg-white p-4 rounded">
        <div className="bg-white rounded h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search user by name..."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            autoFocus
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoSearchOutline size={25} />
          </div>
        </div>

        <div className="mt-4">
          {filteredStudents.length === 0 && search.trim() !== "" && (
            <p className="text-center text-slate-500">No user found!</p>
          )}

          {filteredStudents.length > 0 && (
            <div className="mt-2">
              {filteredStudents.map((student) => (
                <UserSearchCard 
                  key={student["Student ID"]}
                  userId={student["Student ID"]}
                  name={student.Name}
                  email={undefined} // Add email if available in the data
                  profile_pic={student.profile_pic}
                  onClose={onClose} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="absolute top-4 right-4 text-2xl hover:text-white" onClick={onClose}>
        <IoClose />
      </button>
    </div>
  );
};

export default SearchUser;
