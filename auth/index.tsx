import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { adminAction } from "../redux/actions/ReduxAction";
import { supabase } from "../services/supaBaseClient";
import { AppUserInfo, Staff } from "../utils/types";
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
    const response = await AuthAPI.getStaffInfo();
    if (response && response.data.status === "Success") {
      dispatch(
        adminAction("admin", { type: "staff", user: response.data.data as any as Staff })
      );
    } else {
      localStorage.removeItem("accessToken");
      router.push("/");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuth(true);
      if (localStorage.getItem("accessToken") !== null) {
        getUserByToken();
        if (pathname.split("/")[1] !== "dashboard") {
          router.push("/dashboard/game");
        }
      } else {
        setAuth(true);
        if (pathname.split("/")[1] === "dashboard") {
          router.push("/");
        }
      }
    }
  }, []);
  console.log(appUserInfo);
  return (
    <>
      {appUserInfo.type === "admin" ? (
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
