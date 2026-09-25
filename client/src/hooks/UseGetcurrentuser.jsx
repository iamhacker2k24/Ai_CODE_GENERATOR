// hooks/UseGetcurrentuser.jsx

import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const UseGetcurrentuser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const result = await axios.get("http://localhost:3000/api/user/me", {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
        console.log("Current user:", result.data);
      } catch (error) {
        console.log(
          "Current user error:",
          error.response?.data || error.message,
        );
      }
    };

    getCurrentUser();
  }, []);
};

export default UseGetcurrentuser;
