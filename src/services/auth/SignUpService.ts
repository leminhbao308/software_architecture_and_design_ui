import axios from "axios";
import APIConst from "../../consts/APIConst";

const SignUpService = {
  signup: async (
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    phone: string
  ) => {
    try {
      const response = await axios.post(
        `${APIConst.API_CONTEXT}${APIConst.SIGNUP}`,
        {
          username,
          first_name: firstName,
          last_name: lastName,
          password,
          email,
          phone,
        }
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("signup failed: ", error);
      throw error; // Ném lỗi để xử lý ở component gọi hàm này
    }
  },
};

export default SignUpService;
