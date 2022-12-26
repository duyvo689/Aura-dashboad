import { useRouter } from "next/router";
import { useState } from "react";
import Header from "../components/Header1";
import SidebarNew from "../components/SidebarNew";
export default function Layout({ children }: any) {
  const { pathname } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      {pathname.split("/")[1] !== "" &&
      pathname.split("/")[1] !== "sign-up" &&
      pathname.split("/")[1] !== "check-mail" &&
      pathname.split("/")[1] !== "forgot-password" &&
      pathname.split("/")[1] !== "phone-login" ? (
        <div className="flex h-screen overflow-hidden">
          <SidebarNew sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main
              className="bg-slate-100 px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto overflow-auto "
              style={{ minHeight: "calc(100vh - 64px)" }}
            >
              {children}
            </main>
          </div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </>
  );
}
