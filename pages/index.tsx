import react, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { Input } from "../components/input";
import { ButtonDefault, ButtonLoadding } from "../components/button";
import { SIGNIN_FORM } from "../constants/input";
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
import { AppUserInfo, MainAdmin } from "../utils/types";
import InputForm from "../components/Form/InputForm";
import SubmitBtn from "../components/Form/SubmitBtn";
const SIGN_IN_FORM = [
  {
    type: "email",
    title: "Email",
    id: "email",
    name: "email",
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: e.target.email.value,
      password: e.target.password.value,
    });

    if (error?.message) {
      setMessage("Sai tài khoản hoặc mật khẩu");
    } else if (data && data.user) {
      dispatch(
        adminAction("admin", {
          type: "admin",
          user: {
            email: data.user.email,
            name: data.user.user_metadata.user_name,
          } as any as MainAdmin,
        })
      );
      localStorage.setItem("isPhoneLogin", "false");
      router.push(`/dashboard/users`);
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
            <div className="flex justify-start items-center p-4 gap-4 h-16">
              <img className="h-full" src={mainLogo.src} alt="Aura logo" />
              <img className="w-24" src="../SheCom.png" alt="SheCom logo" />
            </div>
            <div className="flex-1 flex items-center ">
              <div className="max-w-sm xl:max-w-lg w-full px-4 py-9 mx-auto">
                <h1 className="text-3xl text-slate-800 font-bold mb-6">Chào mừng! ✨</h1>
                <form className="flex flex-col gap-4" onSubmit={signIn}>
                  {SIGN_IN_FORM.map((item, index: number) => {
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
                      <Link href={"/phone-login"}>Đăng nhập với số điện thoại</Link>
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

  //   <div className="  h-full min-h-screen max-h-screen md:overflow-hidden overflow-y-auto md:pt-0 pt-20 relative flex flex-col justify-center items-center ">
  //     <Head>
  //       <title>Sign in</title>
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
  //                 {SIGNIN_FORM.map((input: any, index: number) => {
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
  //               <Link href="/phone-login">
  //                 <div
  //                   // onClick={() => {
  //                   //   toast.success("Tính năng đang phát triển");
  //                   // }}
  //                   className="btn bg-black mt-9 text-white text-center block mb-14 cursor-pointer"
  //                 >
  //                   Đăng nhập với số điện thoại
  //                 </div>
  //               </Link>
  //             </form>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //     <div className="flex justify-center items-center md:absolute bottom-0 py-8">
  //       {`Don't have an account?`}
  //       <Link href="/sign-up" className="text-black ml-4">
  //         <button
  //           type="button"
  //           className="flex items-center border px-6 py-2 rounded-lg"
  //           style={{ borderColor: "rgba(0,0,0,.15)" }}
  //         >
  //           <span>Sign up</span>
  //         </button>
  //       </Link>
  //     </div>
  //   </div>
  // );
}
