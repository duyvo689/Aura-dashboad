import react, { useEffect, useState } from "react";
import Head from "next/head";
import { Input } from "../components/input";
import { ButtonDefault, ButtonLoadding } from "../components/button";
import { SIGNUP_FORM } from "../constants/input";
import { supabase } from "../services/supaBaseClient";
import router from "next/router";
import InputForm from "../components/Form/InputForm";
import SubmitBtn from "../components/Form/SubmitBtn";
import Link from "next/link";
import mainLogo from "../public/images/mainlogo.svg";
import InputValidatePass from "../components/Form/InputValidatePass";
const SIGN_UP_FORM = [
  {
    type: "email",
    title: "Email",
    id: "email",
    name: "email",
    required: true,
  },
  {
    type: "text",
    title: "Tên đăng nhập",
    id: "userName",
    name: "userName",
    required: true,
  },
];
const checkPassword = (password: string) => {
  if (password.length < 8) {
    return "Mật khẩu ít hơn 8 kí tự";
  }
  if (!/[a-z]/.test(password)) {
    return "Mật khẩu không chứa kí tự in thường";
  }
  if (!/[A-Z]/.test(password)) {
    return "Mật khẩu không chứa kí tự in hoa";
  }
  if (!/[0-9]/.test(password)) {
    return "Mật khẩu không chứa số";
  }
  return null;
};
function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const signUp = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const isValidPass = checkPassword(e.target.password.value);
    if (isValidPass !== null) {
      setMessage(isValidPass);
      setIsLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: e.target.email.value,
      password: e.target.password.value,
      options: {
        data: {
          user_name: e.target.userName.value,
        },
      },
    });
    if (error) {
      setMessage(error.message);
    } else if (data) {
      localStorage.setItem("isPhoneLogin", "false");
      router.push(`/check-mail`);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Đăng kí tài khoản</title>
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
                <h1 className="text-3xl text-slate-800 font-bold mb-6">
                  Đăng kí tài khoản ✨
                </h1>
                <form className="flex flex-col gap-4" onSubmit={signUp}>
                  {SIGN_UP_FORM.map((item, index: number) => {
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
                  <InputValidatePass
                    title={"Mật khẩu"}
                    id={"password"}
                    name={"password"}
                    type={"password"}
                    required={true}
                  />
                  {message ? (
                    <div
                      className="p-4  text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                      role="alert"
                    >
                      {message}
                    </div>
                  ) : null}
                  <div className="flex justify-end">
                    <SubmitBtn
                      type={isLoading ? "button" : "submit"}
                      content={isLoading ? "Đang đăng kí..." : "Đăng kí"}
                      size="md"
                    />
                  </div>

                  <hr></hr>
                  <div className="text-sm flex gap-1 cursor-pointer">
                    <div className="text-slate-600">Đã có tài khoản?</div>
                    <Link href="/">
                      <div className="text-indigo-500">Đăng nhập</div>
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
}

export default SignUp;
