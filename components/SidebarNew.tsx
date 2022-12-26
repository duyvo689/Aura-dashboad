import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import mainLogo from "../public/images/mainlogo.svg";

import {
  DashBoardIcon,
  EComerceIcon,
  CommunityIcon,
  FinanceIcon,
  JobIcon,
  TaskIcon,
  MessageIcon,
  InboxIcon,
  CalendarIcon,
  CampainIcon,
} from "../components/Icons/SideBar/index";
import SidebarLinkGroup from "./SidebarLinkGroup";
interface Props {
  sidebarOpen: any;
  setSidebarOpen: any;
}
interface Navigation {
  name: string;
  href: string;
  icon: any;
  pathName: string;
}
interface NavigationGroup {
  title: string;
  active: string[];
  navigation: {
    name: string;
    href: string;
    active: string;
  }[];
}
const navigations: Navigation[] = [
  {
    name: "Quản lý người dùng",
    href: "/dashboard/users",
    icon: (pathname: string) => {
      return <CommunityIcon pathname={pathname} />;
    },
    pathName: "users",
  },
  {
    name: "Quản lý nhân sự",
    href: "/dashboard/roles",
    icon: (pathname: string) => {
      return <TaskIcon pathname={pathname} />;
    },
    pathName: "roles",
  },

  {
    name: " Quản lý phòng khám",
    href: "/dashboard/clinics",
    icon: (pathname: string) => {
      return <EComerceIcon pathname={pathname} />;
    },
    pathName: "clinics",
  },
  {
    name: "Quản lý dịch vụ",
    href: "/dashboard/services",
    icon: (pathname: string) => {
      return <CampainIcon pathname={pathname} />;
    },
    pathName: "services",
  },
  {
    name: "Quản lý đặt hẹn",
    href: "/dashboard/bookings",
    icon: (pathname: string) => {
      return <CalendarIcon pathname={pathname} />;
    },
    pathName: "bookings",
  },
];
const navigationGroup: NavigationGroup[] = [
  {
    title: "Cài đặt",
    active: ["category", "payments", "customer-status", "coupons", "banners"],
    navigation: [
      {
        name: "Danh mục sản phẩm",
        href: "/dashboard/category",
        active: "category",
      },
      {
        name: "Phương thức thanh toán",
        href: "/dashboard/payments",
        active: "payments",
      },
      {
        name: "Tình trạng khách hàng",
        href: "/dashboard/customer-status",
        active: "customer-status",
      },
      {
        name: "Coupons",
        href: "/dashboard/coupons",
        active: "coupons",
      },
      {
        name: "Banners",
        href: "/dashboard/banners",
        active: "banners",
      },
    ],
  },
];
function SidebarNew({ sidebarOpen, setSidebarOpen }: Props) {
  const { pathname } = useRouter();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const [sidebarExpanded, setSidebarExpanded] = useState<boolean | null>(null);
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: any }) => {
      if (!sidebar.current || !trigger.current) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });
  // useEffect(() => {
  //   const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  //   setSidebarExpanded(
  //     storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  //   );
  // }, []);

  return (
    <div>
      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64  lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out 
       translate-x-0
        `}
      >
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          <img
            ref={trigger}
            className="h-8 w-auto"
            src={mainLogo.src}
            alt="Aura Group Logo"
          />
        </div>
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span className="block">Điều hướng</span>
            </h3>
            {/* Normal navigation */}
            <ul className="mt-3">
              {navigations.map((item, index: number) => {
                return (
                  <li
                    key={index}
                    className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 cursor-pointer ${
                      pathname.includes(item.pathName) && "bg-slate-900"
                    }`}
                  >
                    <Link
                      href={`${item.href}`}
                      className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                        pathname.includes(item.pathName) && "hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon(pathname)}
                        <span
                          className={`text-sm font-medium ml-3 block duration-200 text-slate-300 ${
                            (pathname === "/" || pathname.includes(item.pathName)) &&
                            "!text-indigo-500"
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* Group navigation */}
            {navigationGroup &&
              navigationGroup.map((item, index: number) => {
                return (
                  <SidebarLinkGroup
                    key={index}
                    activecondition={item.active.includes(pathname.split("/")[2])}
                  >
                    {(handleClick: any, open: any) => {
                      return (
                        <React.Fragment>
                          <div
                            className={`block text-slate-200 hover:text-white truncate transition duration-150 cursor-pointer ${
                              item.active.includes(pathname.split("/")[2]) &&
                              "hover:text-slate-200"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                                  <path
                                    className={`fill-current ${
                                      item.active.includes(pathname.split("/")[2])
                                        ? "text-indigo-500"
                                        : "text-slate-600 "
                                    }`}
                                    d="M19.714 14.7l-7.007 7.007-1.414-1.414 7.007-7.007c-.195-.4-.298-.84-.3-1.286a3 3 0 113 3 2.969 2.969 0 01-1.286-.3z"
                                  />
                                  <path
                                    className={`fill-current  ${
                                      item.active.includes(pathname.split("/")[2])
                                        ? "text-indigo-300"
                                        : "text-slate-400"
                                    }`}
                                    d="M10.714 18.3c.4-.195.84-.298 1.286-.3a3 3 0 11-3 3c.002-.446.105-.885.3-1.286l-6.007-6.007 1.414-1.414 6.007 6.007z"
                                  />
                                  <path
                                    className={`fill-current  ${
                                      item.active.includes(pathname.split("/")[2])
                                        ? "text-indigo-500"
                                        : "text-slate-600"
                                    }`}
                                    d="M5.7 10.714c.195.4.298.84.3 1.286a3 3 0 11-3-3c.446.002.885.105 1.286.3l7.007-7.007 1.414 1.414L5.7 10.714z"
                                  />
                                  <path
                                    className={`fill-current ${
                                      item.active.includes(pathname.split("/")[2])
                                        ? "text-indigo-300"
                                        : "text-slate-400"
                                    }`}
                                    d="M19.707 9.292a3.012 3.012 0 00-1.415 1.415L13.286 5.7c-.4.195-.84.298-1.286.3a3 3 0 113-3 2.969 2.969 0 01-.3 1.286l5.007 5.006z"
                                  />
                                </svg>
                                <span
                                  className={`${
                                    item.active.includes(pathname.split("/")[2])
                                      ? "text-indigo-500"
                                      : "text-slate-300"
                                  }
                                   hover:text-white text-sm font-medium ml-3  duration-200`}
                                >
                                  {item.title}
                                </span>
                              </div>
                              {/* Icon */}
                              <div className="flex shrink-0 ml-2">
                                <svg
                                  className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                    open && "rotate-180"
                                  }`}
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                            {item.navigation.map((navigator, index: number) => {
                              return (
                                <li
                                  className="mb-1 last:mb-0 cursor-pointer "
                                  key={index}
                                >
                                  <Link href={navigator.href}>
                                    <div
                                      className={`${
                                        !pathname.includes(navigator.active)
                                          ? "text-slate-500"
                                          : "text-indigo-500"
                                      } block hover:text-slate-200 transition duration-150 truncate`}
                                    >
                                      <span className="text-sm font-medium duration-200">
                                        {navigator.name}
                                      </span>
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                );
              })}
          </div>
        </div>
      </div>

      <div className="pt-3 hidden  justify-end mt-auto">
        <div className="px-3 py-2">
          <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
            <svg
              className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
              viewBox="0 0 24 24"
            >
              <path
                className="text-slate-400"
                d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
              />
              <path className="text-slate-600" d="M3 23H1V1h2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SidebarNew;
