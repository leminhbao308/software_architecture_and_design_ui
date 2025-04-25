import {UserType} from "./UserType.ts";

export interface UserContextType {
  userId: string;
  setUserId: (id: string) => void;
  userInfo: UserType | undefined,
  setUserInfo: (userInfo: UserType) => void;
}
