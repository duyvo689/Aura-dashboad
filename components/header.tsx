import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useEffect, useState, Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3BottomLeftIcon,
  BellIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Avatar } from "flowbite-react";
import { supabase } from "../services/supaBaseClient";
import router from "next/router";
import { RootState } from "../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
const userNavigation = [
  { name: "Tài khoản", href: "/dashboard/roles" },
  { name: "Cài đặt", href: "/dashboard/roles" },
  { name: "Đăng xuất", href: "/" },
];
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
function redirect(link: string) {
  return router.push(link);
}
function HeaderDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const admin: any = useSelector((state: RootState) => state.admin);
  const signOut = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (!error) {
      redirect("/");
    }
  };
  return (
    <div className="w-full flex flex-col md:px-4 xl:px-4 my-2">
      <div className="sticky py-2 top-0 z-10 flex flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="flex flex-1 justify-between px-4 md:px-0">
          <div className="flex flex-1">
            {/* <form className="flex w-full md:ml-0" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="search-field"
                  className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                  placeholder="Search"
                  type="search"
                  name="search"
                />
              </div>
            </form> */}
          </div>
          <div className="ml-4 flex items-center  md:ml-6">
            <div>Chào, {admin?.user_metadata?.user_name}</div>
            <button
              type="button"
              className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  <Avatar
                    img={`https://ui-avatars.com/api/?name=${admin?.user_metadata?.user_name}&&background=random`}
                    size="sm"
                    rounded={true}
                    alt="avatar"
                  />
                  {/* <img
                      src={`https://ui-avatars.com/api/?name=${admin.user_metadata.user_name}&&background=random`}
                      alt="avatar"
                    /> */}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <a
                          onClick={
                            item.name === "Sign out"
                              ? signOut
                              : () => {
                                  redirect(item.href);
                                }
                          }
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block py-2 px-4 text-sm text-gray-700"
                          )}
                        >
                          <button
                            onClick={
                              item.name === "Sign out"
                                ? signOut
                                : () => {
                                    redirect(item.href);
                                  }
                            }
                          >
                            {item.name}
                          </button>
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
export { HeaderDashboard };
