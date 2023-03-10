import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { adminAction } from "../redux/actions/ReduxAction";
import { supabase } from "../services/supaBaseClient";
import { AppUserInfo, MainAdmin, Staff } from "../utils/types";
import { RootState } from "../redux/reducers";
import { AuthAPI } from "../api";
import toast from "react-hot-toast";
function AuthRoute({ children }: any) {
  const dispatch = useDispatch();
  const appUserInfo: AppUserInfo = useSelector((state: RootState) => state.admin);
  const router = useRouter();
  const pathname = router.pathname;
  const [auth, setAuth] = useState(false);

  const getUserByToken = async () => {
    ///
    const response = await AuthAPI.getStaffInfo();
    if (response && response.data.status === "Success") {
      dispatch(
        adminAction("admin", { type: "staff", user: response.data.data as any as Staff })
      );
      setAuth(true);
    } else {
      setAuth(true);
      localStorage.removeItem("accessToken");
      router.push("/phone-login");
    }
  };
  const getUserAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      dispatch(
        adminAction("admin", {
          type: "admin",
          user: {
            email: user.email,
            name: user.user_metadata.user_name,
          } as any as MainAdmin,
        })
      );
      setAuth(true);
    } else {
      setAuth(true);
      router.push("/");
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("isPhoneLogin") === "true") {
        if (localStorage.getItem("accessToken") !== null) {
          getUserByToken();
          if (pathname.split("/")[1] === "") {
            router.push("/dashboard/users");
          }
        } else {
          setAuth(true);
          if (pathname.split("/")[1] !== "") {
            router.push("/");
          }
        }
      } else if (!localStorage.getItem("isPhoneLogin")) {
        setAuth(true);
        if (pathname.split("/")[1] !== "") {
          router.push("/");
        }
      } else {
        getUserAdmin();
      }
    }
  }, []);
  return (
    <>
      {appUserInfo && appUserInfo.type === "admin" ? (
        <>{children}</>
      ) : (
        <>
          {auth === false ? (
            <div>Check Login</div>
          ) : pathname.split("/")[1] === "dashboard" &&
            localStorage.getItem("accessToken") === null ? null : pathname.split(
              "/"
            )[1] === "" &&
            localStorage.getItem("accessToken") !== null &&
            appUserInfo === null ? null : (
            children
          )}
        </>
      )}
    </>
  );
}

export default AuthRoute;
