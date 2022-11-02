import react, { useEffect, useState } from "react";
import Head from "next/head";

import { Input } from "../components/input";
import { ButtonDefault, ButtonLoadding } from "../components/button";
import { SIGNUP_FORM } from "../constants/input";
import { supabase } from "../services/supaBaseClient";
// import { UserAPI } from "../api";
// import { userAction } from "../redux/actions/reduxAction";
// import { userTab } from "../constant/redux";
import router from "next/router";
// import { IUSER } from "../types/types";
// import { AdminAPI } from "../services/api";
// import { app } from "../firebase/index";

function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const signUp = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: e.target.email.value,
      password: e.target.password.value,
      options: {
        data: {
          user_name: e.target.userName.value,
        },
      },
    });
    setIsLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (data) {
      console.log(data);
      router.push(`/check-mail`);
    }
  };
  return (
    <div className="h-full min-h-screen max-h-screen md:overflow-hidden overflow-y-auto md:pt-0 pt-20 relative flex flex-col justify-center items-center ">
      <Head>
        <title>Sign up</title>
        <meta property="og:title" content="Sign up page" key="title" />
      </Head>
      <section>
        <div className="mx-auto px-5 sm:px-6">
          <div className="md:max-w-none flex justify-center mb-4">
            <div className="px-2 sm:w-96 w-80">
              <div className="mt-12 mb-11">
                <h1 className="mb-5 text-4xl font-medium text-center">
                  Sign up
                </h1>
              </div>
              <form className="flex-col flex gap-4" onSubmit={signUp}>
                <div className="grid grid-cols-1 gap-2">
                  {SIGNUP_FORM.map((input: any, index: number) => {
                    return <Input input={input} key={index + 1} />;
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
                  <ButtonLoadding title={"Signing up..."} />
                ) : (
                  <ButtonDefault title={"Sign up"} />
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
