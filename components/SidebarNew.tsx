import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import mainLogo from "../public/images/mainlogo.svg";
import {
  UsersIcon,
  PhotoIcon,
  UserPlusIcon,
  MapPinIcon,
  NewspaperIcon,
  BanknotesIcon,
  WalletIcon,
  ClipboardDocumentCheckIcon,
  GiftIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

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
const navigations: Navigation[] = [
  // { name: "Home", href: "/", icon: HomeIcon, pathName: "home" },
  {
    name: "Quản lý nhân sự",
    href: "/dashboard/roles",
    icon: UserPlusIcon,
    pathName: "roles",
  },
  {
    name: "Quản lý người dùng",
    href: "/dashboard/users",
    icon: UsersIcon,
    pathName: "users",
  },
  {
    name: "Quản lý banner",
    href: "/dashboard/banners",
    icon: PhotoIcon,
    pathName: "banners",
  },
  {
    name: " Quản lý phòng khám",
    href: "/dashboard/clinics",
    icon: MapPinIcon,
    pathName: "clinics",
  },
  {
    name: "Quản lý dịch vụ",
    href: "/dashboard/services",
    icon: ClipboardDocumentCheckIcon,
    pathName: "services",
  },
  {
    name: "Quản lý danh mục",
    href: "/dashboard/category",
    icon: NewspaperIcon,
    pathName: "category",
  },
  {
    name: "Phương thức thanh toán",
    href: "/dashboard/payments",
    icon: BanknotesIcon,
    pathName: "payments",
  },
  // {
  //   name: "Nguồn khách hàng",
  //   href: "/dashboard/customer-resources",
  //   icon: IdentificationIcon,
  //   pathName: "customer-resources",
  // },
  {
    name: "Danh sách coupons",
    href: "/dashboard/coupons",
    icon: GiftIcon,
    pathName: "coupons",
  },
  {
    name: "Quản lý đặt hẹn",
    href: "/dashboard/bookings",
    icon: PencilSquareIcon,
    pathName: "bookings",
  },
  {
    name: "Quản lý tình trạng KH",
    href: "/dashboard/customer-status",
    icon: PencilSquareIcon,
    pathName: "customer-status",
  },
  // {
  //   name: "Quản lý thanh toán",
  //   href: "/dashboard/checkouts",
  //   icon: WalletIcon,
  //   pathName: "checkout",
  // },
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
      //   if (
      //     !sidebarOpen ||
      //     sidebar.current.contains(target) ||
      //     trigger.current.contains(target)
      //   )
      //     return;
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
        {/* Sidebar header */}
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
            <ul className="mt-3">
              {navigations.map((item, index: number) => {
                return (
                  <li
                    key={index}
                    className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
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
                        <item.icon
                          className={`w-6 h-6  text-slate-300 ${
                            (pathname === "/" || pathname.includes(item.pathName)) &&
                            "!text-indigo-500"
                          }`}
                        />

                        <span className="text-sm font-medium ml-3 block duration-200 text-white">
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      {/* Expand / collapse button */}
      <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
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
