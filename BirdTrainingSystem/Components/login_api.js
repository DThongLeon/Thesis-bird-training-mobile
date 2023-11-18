import axios from "axios";

const baseUrl ="http://13.214.85.41/api";


export   const login_api = async val => {
  try {
    const result = await axios.post(
        `${baseUrl}/auth/login`, 
        val
    )
    return result;
  } catch (err) {
    return err.response;
  }
};

