import { useRouter } from "next/router";
import { HeaderDashboard } from "../components/header";
import Sidebar from "../components/sidebar";
export default function Layout({ children }: any) {
  const { pathname } = useRouter();
  return (
    <>
      {pathname.split("/")[1] !== "" &&
      pathname.split("/")[1] !== "sign-up" &&
      pathname.split("/")[1] !== "check-mail" &&
      pathname.split("/")[1] !== "forgot-password" ? (
        <>
          <Sidebar />
          <div className="md:pl-64 flex flex-col">
            <HeaderDashboard />
            {children}
          </div>
        </>
      ) : (
        <div>{children}</div>
      )}
    </>
    // <>
    //   {pathname.split("/")[1] !== "" &&
    //     pathname.split("/")[1] !== "sign-up" &&
    //     pathname.split("/")[1] !== "check-mail" &&
    //     pathname.split("/")[1] !== "forgot-password" && (
    //       <>
    //         <div className="bg-gray-50 ">
    //           <HeaderDashboard />
    //           <div className="flex overflow-hidden bg-white min-h-screen pt-16">
    //             <Sidebar />
    //             <>{children}</>
    //           </div>
    //         </div>
    //       </>
    //     )}
    // </>
  );
}
