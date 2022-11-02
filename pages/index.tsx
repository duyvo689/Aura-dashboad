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
export interface LoginProps {}

export default function SignInPage(props: LoginProps) {
  // const provider = new GoogleAuthProvider();
  // const auth = getAuth(app);
  // const user: IUSER = useSelector((state: RootState) => state.user);
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
    setIsLoading(false);
    if (error?.message) {
      setMessage(error?.message);
    }
    if (data && data.user) {
      dispatch(adminAction("admin", data.user));
      router.push(`/dashboard/roles`);
    }
  };
  return (
    <div className="  h-full min-h-screen max-h-screen md:overflow-hidden overflow-y-auto md:pt-0 pt-20 relative flex flex-col justify-center items-center ">
      <Head>
        <title>Sign in</title>
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
                  {SIGNIN_FORM.map((input: any, index: number) => {
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
                  <ButtonLoadding title={"Signing in..."} />
                ) : (
                  <ButtonDefault title={"Sign in"} />
                )}
                <Link
                  href="/forgot-password"
                  className="mt-9 text-black text-center block hover:text-gray-500 mb-14"
                >
                  Forgot your password?
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div className="flex justify-center items-center md:absolute bottom-0 py-8">
        {`Don't have an account?`}
        <Link href="/sign-up" className="text-black ml-4">
          <button
            type="button"
            className="flex items-center border px-6 py-2 rounded-lg"
            style={{ borderColor: "rgba(0,0,0,.15)" }}
          >
            <span>Sign up</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
