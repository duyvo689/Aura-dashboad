import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { adminAction } from "../redux/actions/ReduxAction";
import { supabase } from "../services/supaBaseClient";
function AuthRoute({ children }: any) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = router.pathname;
  const [auth, setAuth] = useState(false);
  const initFlag = useRef(false);
  const getUser = async () => {
    //check if session invalid
    initFlag.current = true;
    const {
      data: { session: currentSession },
      error,
    } = await supabase.auth.getSession();
    if (currentSession) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user);
      setAuth(true);
      dispatch(adminAction("admin", user));
      // router.push(`/dashboard/roles`);
    } else {
      router.push("/");
    }
  };
  useEffect(() => {
    if (!initFlag.current) {
      getUser();
    }
  }, []);
  useEffect(() => {}, [auth]);
  return (
    <>{children}</>
    // <>{auth === false ? <div>Check Login</div> : <>{children}</>}</>
  );
}

export default AuthRoute;
