import { useRouter } from "next/router";
import { useState } from "react";
import Header from "../components/Header1";
import Sidebar from "../components/Sidebar";
export default function Layout({ children }: any) {
  const { pathname } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      {pathname.split("/")[1] !== "" &&
      pathname.split("/")[1] !== "sign-up" &&
      pathname.split("/")[1] !== "check-mail" &&
      pathname.split("/")[1] !== "forgot-password" ? (
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto bg-slate-100">
                {children}
              </div>
            </main>
          </div>
          {/* <div className="md:pl-64 flex flex-col">
            <Header />
            <div
              style={{
                margin: "auto",
                width: "100%",
                height: "100%",
              }}
            >
              {children}
            </div>
          </div> */}
        </div>
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
