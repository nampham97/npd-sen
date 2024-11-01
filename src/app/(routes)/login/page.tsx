"use client";
import { APILogin } from "@/app/apis/Auth";
import { Button, Input } from "antd";
import React from "react";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

function page() {
  const [loginInfo, setLoginInfo] = React.useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const HandleLogin = async () => {
    setLoading(true);
    const res = await APILogin(loginInfo);
    setLoading(false);
    console.log("ress", res);
    if (res.status === 200 || res.status === 201) {
      localStorage.setItem("user_NPDSEN", res.data.token);
      // Phân tích token, nếu bắt đầu token là teamba thì chuyển hướng sang trang team-ba
      if (res.data.token.split("_")[0] === "teamba") {
        window.location.href = "/team-ba/guide-by-speech";
      }
    }
  };
  return (
    <div>
      {/* Display video background from url fixed to screen */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source
          src="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          type="video/mp4"
        />
      </video>

      {/* Login form center */}
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white bg-opacity-20 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl text-white font-bold text-center mb-4 font-serif">
            LOGIN NPD-SEN
          </h1>
          <form className="space-y-4">
            <Input
              value={loginInfo.username}
              onChange={({ target }) =>
                setLoginInfo({ ...loginInfo, username: target.value })
              }
              size="large"
              placeholder="Tài khoản"
              prefix={<FaUser />}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  loginInfo.password &&
                  loginInfo.username
                ) {
                  HandleLogin();
                }
              }}
            />
            <Input
              value={loginInfo.password}
              onChange={({ target }) =>
                setLoginInfo({ ...loginInfo, password: target.value })
              }
              type="password"
              size="large"
              placeholder="Mật khẩu"
              prefix={<RiLockPasswordFill />}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  loginInfo.password &&
                  loginInfo.username
                ) {
                  HandleLogin();
                }
              }}
            />
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  if (loginInfo.password && loginInfo.username) {
                    HandleLogin();
                  }
                }}
                loading={loading}
                disabled={loading}
                type="primary"
              >
                Đăng nhập
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default page;
