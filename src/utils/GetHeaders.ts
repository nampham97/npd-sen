import axios from "axios";

let isRefreshing = false;
let refreshSubscribers: ((newToken: string) => void)[] = [];

function onRefreshed(newToken: string): void {
    refreshSubscribers.forEach(callback => callback(newToken));
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (newToken: string) => void): void {
    refreshSubscribers.push(callback);
}

export async function GetHeaders() {
    const user = JSON.parse(localStorage.getItem("user_YANG")!)
    const JWTRe = user?.refreshToken;
    const JWTAc = user?.accessToken;
    if (!JWTRe) {
        localStorage.removeItem("user_YANG");
        window.location.href = "/";
    }

    const jwtPayloadRe = JSON.parse(window.atob(JWTRe.split(".")[1]));
    const jwtPayloadAc = JSON.parse(window.atob(JWTAc.split(".")[1]));
    const expRe = jwtPayloadRe.exp;
    const expAc = jwtPayloadAc.exp;
    const now = Math.floor(Date.now() / 1000);
    if (expRe - now < 0) {
        const logout = async () => {
            localStorage.removeItem("user_YANG");
            localStorage.removeItem("device_YANG");
        }
        logout()
    } else if (expAc - now < 0) {
        const RefreshToken = async () => {
            if (isRefreshing) {
                return new Promise(resolve => addRefreshSubscriber(resolve));
            }
            isRefreshing = true;
            try {
                const refreshToken = user?.refreshToken;
                const headers = {
                    Authorization: `Bearer ${refreshToken}`,
                    "device-token": localStorage.getItem("device_YANG"),
                };
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
                    { headers }
                );

                if (res?.status === 200 || res?.status === 201) {
                    const data = res.data.metadata;
                    user.accessToken = data.accessToken;
                    user.refreshToken = data.refreshToken;
                    localStorage.setItem("user_YANG", JSON.stringify(user));
                    onRefreshed(data.accessToken);
                    return data.accessToken;
                } else {
                    localStorage.removeItem("user_YANG");
                    localStorage.removeItem("device_YANG");

                }
            } catch (error) {
                throw new Error("Refresh token failed");
            } finally {
                isRefreshing = false;
            }



        };
        const new_token = await RefreshToken();
        return new_token;
    }
}