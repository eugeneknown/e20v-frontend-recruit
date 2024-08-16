import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    const { auth, setAuth, isAuth } = useContext(AuthContext);
    // console.log('debug auth:', auth);
    // useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth;