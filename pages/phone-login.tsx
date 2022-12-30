import react, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";

import { useDispatch, useSelector } from "react-redux";
import router from "next/router";

import { adminAction } from "../redux/actions/ReduxAction";
import mainLogo from "../public/images/mainlogo.svg";
import { supabase } from "../services/supaBaseClient";
import toast from "react-hot-toast";
import { AuthAPI } from "../api";
import { Staff } from "../utils/types";
import SubmitBtn from "../components/Form/SubmitBtn";
import InputForm from "../components/Form/InputForm";

const SIGNIN_FORM_PHONE = [
  {
    type: "text",
    title: "Số điện thoại",
    id: "phone",
    name: "phone",
    required: true,
  },
  {
    type: "password",
    title: "Mật khẩu",
    id: "password",
    name: "password",
    required: true,
  },
];
export default function SignInPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const signIn = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (e.target.phone.value === "" || e.target.password.value === "") {
      toast.error("Nhập thiếu dữ liệu. Kiểm tra lại");
      setIsLoading(false);
      return;
    }
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
      localStorage.setItem("isPhoneLogin", "true");
      router.push(`/dashboard/users`);
    } else {
      setMessage(response.data.message);
    }

    setIsLoading(false);
  };
  return (
    <>
      <Head>
        <title>Đăng nhập</title>
        <meta property="og:title" content="Sign in page" key="title" />
      </Head>
      <main className="max-h-screen max-w-screen grid grid-cols-2">
        <div className="w-full">
          <div className="flex flex-col min-h-screen h-full">
            <div className="flex justify-start h-16 p-4">
              <img className="h-full" src={mainLogo.src} alt="main logo" />
            </div>
            <div className="flex-1 flex items-center ">
              <div className="max-w-sm xl:max-w-lg w-full px-4 py-9 mx-auto">
                <h1 className="text-3xl text-slate-800 font-bold mb-6">Chào mừng! ✨</h1>
                <form className="flex flex-col gap-4" onSubmit={signIn}>
                  {SIGNIN_FORM_PHONE.map((item, index: number) => {
                    return (
                      <InputForm
                        key={index}
                        title={item.title}
                        id={item.id}
                        name={item.name}
                        type={item.type}
                        required={item.required}
                      />
                    );
                  })}
                  {message ? (
                    <div
                      className="p-4 my-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                      role="alert"
                    >
                      {message}
                    </div>
                  ) : null}
                  <div className="flex flex-col items-center justify-center gap-2">
                    <SubmitBtn
                      type={isLoading ? "button" : "submit"}
                      content={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                      size="lg"
                    />
                    <div className="font-medium text-base text-slate-800">- Hoặc -</div>
                    <button
                      className={`btn bg-indigo-500 hover:bg-indigo-600 text-white w-60`}
                      type="button"
                    >
                      <Link href={"/"}>Đăng nhập với email</Link>
                    </button>
                  </div>

                  <hr></hr>
                  <div className="text-sm flex gap-1 cursor-pointer">
                    <div className="text-slate-600">Chưa có tài khoản?</div>
                    <Link href="/sign-up">
                      <div className="text-indigo-500">Đăng kí</div>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative min-h-screen">
          <img src={"./signUpImg.png"} className="w-full h-full absolute top-0 left-0" />
        </div>
      </main>
    </>
  );
  // return (
  //   <div className="h-full min-h-screen max-h-screen md:overflow-hidden overflow-y-auto md:pt-0 pt-20 relative flex flex-col justify-center items-center ">
  //     <Head>
  //       <title>Đăng nhập với số điện thoại</title>
  //       <meta property="og:title" content="Sign in page" key="title" />
  //     </Head>
  //     <section>
  //       <div className="mx-auto px-5 sm:px-6">
  //         <div className="md:max-w-none flex justify-center mb-4">
  //           <div className="px-2 sm:w-96 w-80">
  //             <div className="mt-12 mb-11">
  //               <img src={mainLogo.src} alt="main logo" />
  //             </div>
  //             <form className="flex-col flex gap-4" onSubmit={signIn}>
  //               <div className="grid grid-cols-1 gap-4">
  //                 {SIGNIN_FORM_PHONE.map((input: any, index: number) => {
  //                   return <Input input={input} key={index} />;
  //                 })}
  //               </div>
  //               {message ? (
  //                 <div
  //                   className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
  //                   role="alert"
  //                 >
  //                   {message}
  //                 </div>
  //               ) : null}
  //               {isLoading ? (
  //                 <ButtonLoadding title={"Đang đăng nhập..."} />
  //               ) : (
  //                 <ButtonDefault title={"Đăng nhập"} />
  //               )}
  //               <Link href="/">
  //                 <div
  //                   // onClick={() => {
  //                   //   toast.success("Tính năng đang phát triển");
  //                   // }}
  //                   className="btn bg-black mt-9 text-white text-center block mb-14 cursor-pointer"
  //                 >
  //                   Đăng nhập email
  //                 </div>
  //               </Link>
  //               {/* <Link href="/forgot-password"> */}
  //               {/* <div
  //                 onClick={() => {
  //                   toast.success("Tính năng đang phát triển");
  //                 }}
  //                 className="mt-9 text-black text-center block mb-14"
  //               >
  //                 Forgot your password ?
  //               </div> */}
  //               {/* </Link> */}
  //             </form>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //   </div>
  // );
}
