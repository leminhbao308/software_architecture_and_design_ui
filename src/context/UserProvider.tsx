import React, { useState, ReactNode } from "react";
import UserContext from "./UserContext";

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string>("");

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
