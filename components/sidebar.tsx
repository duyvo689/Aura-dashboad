import { useRouter } from "next/router";
import {
  UsersIcon,
  PhotoIcon,
  UserPlusIcon,
  MapPinIcon,
  NewspaperIcon,
  BanknotesIcon,
  IdentificationIcon,
  ClipboardDocumentCheckIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import mainLogo from "../public/images/mainlogo.svg";
import Link from "next/link";

const navigation = [
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
          <img className="h-8 w-auto" src={mainLogo.src} alt="Aura Group Logo" />
        </div>
        <div className="mt-5 flex flex-grow flex-col">
          <nav className="flex-1 space-y-1 px-2 pb-4">
            {navigation.map((item) => (
              <Link href={item.href} key={item.name}>
                <div
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
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
export default SideBar;
