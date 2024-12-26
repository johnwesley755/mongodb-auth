
import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const AppContext = createContext();

export const AppcontextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData,setUserData] = useState(false);
  
    const getUserData = async () => {
        try{
            const {data} = await axios.get(backendUrl + '/api/user/data');
            data.success ? setUserData(data.userdata) : toast.error(data.message);
        }
        catch(error){
            toast.error(data.message);
        }
    }
    const value = {
    backendUrl,
    isLoggedIn, setIsLoggedIn,
    userData, setUserData, getUserData
  }; // Define any default values here

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
