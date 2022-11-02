import { useRouter } from "next/router";
import {
  UsersIcon,
  PhotoIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import mainLogo from "../public/images/mainlogo.svg";
import Link from "next/link";

const navigation = [
  // { name: "Home", href: "/", icon: HomeIcon, pathName: "home" },
  {
    name: "Roles",
    href: "/dashboard/roles",
    icon: UserPlusIcon,
    pathName: "roles",
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: UsersIcon,
    pathName: "users",
  },
  {
    name: "Banners",
    href: "/dashboard/banners",
    icon: PhotoIcon,
    pathName: "banners",
  },
  //   { name: "Documents", href: "#", icon: InboxIcon, pathName: "banners" },
  //   { name: "Reports", href: "#", icon: ChartBarIcon },
];
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

function SideBar() {
  const { pathname } = useRouter();
  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
        <div className="flex flex-shrink-0 items-center px-4">
          <img
            className="h-8 w-auto"
            src={mainLogo.src}
            alt="Aura Group Logo"
          />
        </div>
        <div className="mt-5 flex flex-grow flex-col">
          <nav className="flex-1 space-y-1 px-2 pb-4">
            {navigation.map((item) => (
              <Link
                href={item.href}
                key={item.name}
                className={classNames(
                  pathname.split("/")[2] === item.pathName
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                )}
              >
                <item.icon
                  className={classNames(
                    pathname.split("/")[2] === item.pathName
                      ? "text-gray-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 flex-shrink-0 h-6 w-6"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
export default SideBar;