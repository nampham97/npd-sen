import axios from "axios";

export const APILogin = async (loginInfo: {
    username: string,
    password: string
}) => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/authen`, loginInfo)
    return res
};