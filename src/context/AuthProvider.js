import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [isAuth, setIsAuth] = useState(false);
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist, isAuth, setIsAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;