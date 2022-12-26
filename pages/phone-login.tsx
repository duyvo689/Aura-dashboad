import react, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";

import { Input } from "../components/input";
import { ButtonDefault, ButtonLoadding } from "../components/button";
import { SIGNIN_FORM, SIGNIN_FORM_PHONE } from "../constants/input";
import { useDispatch, useSelector } from "react-redux";
import router from "next/router";
// import { IUSER } from "../types/types";
// import FullLogo from "../public/full-logo-header.svg";
// import LogoResposive from "../public/full-logo.svg";
// import { AdminAPI } from "../services/api";
import { adminAction } from "../redux/actions/ReduxAction";
import mainLogo from "../public/images/mainlogo.svg";
import { supabase } from "../services/supaBaseClient";
import toast from "react-hot-toast";
import { AuthAPI } from "../api";
import { Staff } from "../utils/types";
import { AxiosResponse } from "axios";
export interface LoginProps {}

export default function SignInPage(props: LoginProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const signIn = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await AuthAPI.loginWithPhone(
      e.target.phone.value,
      e.target.password.value
    );

    if (response && response.data.status === "Success") {
      console.log(response.data);
      dispatch(
        adminAction("admin", { type: "staff", user: response.data.data as any as Staff })
      );

      localStorage.setItem("accessToken", response.data.token);
      router.push(`/dashboard/users`);
    } else {
      toast.error(response.data.message);
    }

    setIsLoading(false);
  };
  return (
    <div className="h-full min-h-screen max-h-screen md:overflow-hidden overflow-y-auto md:pt-0 pt-20 relative flex flex-col justify-center items-center ">
      <Head>
        <title>Đăng nhập với số điện thoại</title>
        <meta property="og:title" content="Sign in page" key="title" />
      </Head>
      <section>
        <div className="mx-auto px-5 sm:px-6">
          <div className="md:max-w-none flex justify-center mb-4">
            <div className="px-2 sm:w-96 w-80">
              <div className="mt-12 mb-11">
                <img src={mainLogo.src} alt="main logo" />
              </div>
              <form className="flex-col flex gap-4" onSubmit={signIn}>
                <div className="grid grid-cols-1 gap-4">
                  {SIGNIN_FORM_PHONE.map((input: any, index: number) => {
                    return <Input input={input} key={index} />;
                  })}
                </div>
                {message ? (
                  <div
                    className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                    role="alert"
                  >
                    {message}
                  </div>
                ) : null}
                {isLoading ? (
                  <ButtonLoadding title={"Đang đăng nhập..."} />
                ) : (
                  <ButtonDefault title={"Đăng nhập"} />
                )}
                {/* <Link href="/forgot-password"> */}
                {/* <div
                  onClick={() => {
                    toast.success("Tính năng đang phát triển");
                  }}
                  className="mt-9 text-black text-center block mb-14"
                >
                  Forgot your password ?
                </div> */}
                {/* </Link> */}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
