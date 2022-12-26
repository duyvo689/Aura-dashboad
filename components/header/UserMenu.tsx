import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Transition from "../../utils/components/Transition";

import UserAvatar from "../../images/user-avatar-32.png";
import { RootState } from "../../redux/reducers";
import { useSelector } from "react-redux";
import { AppUserInfo } from "../../utils/types";
import router from "next/router";
import ModalUpdatePassword from "./ModalUpdatePassword";

function UserMenu() {
  const appUserInfo: AppUserInfo = useSelector((state: RootState) => state.admin);
  console.log(appUserInfo);
  const [dropdownOpen, setDropdownOpen] = useState<boolean | null>(false);
  const [openModalUpdatePassWord, setOpenModalUpdatePassword] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(trigger);
  const logOut = async () => {
    router.push("/phone-login");
    localStorage.removeItem("accessToken");
  };
  return (
    <div className="relative inline-flex" ref={trigger}>
      <button
        // ref={trigger}
        className="inline-flex justify-center items-center group"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <img
          className="w-8 h-8 rounded-full"
          src={
            appUserInfo?.user?.avatar
              ? appUserInfo.user.avatar
              : "../images/default-avatar.png"
          }
          width="32"
          height="32"
          alt="User"
        />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium group-hover:text-slate-800">
            {appUserInfo.user?.name || appUserInfo.user?.email}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className="origin-top-right z-10 absolute top-full right-0 min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200">
            <div className="font-medium text-slate-800">
              {appUserInfo.user?.name || appUserInfo.user?.email}
            </div>
            <div className="text-xs text-slate-500 italic">
              {appUserInfo.type === "staff" ? "Nhân viên" : "Admin"}
            </div>
          </div>
          <ul>
            <li>
              <div
                onClick={() => {
                  setOpenModalUpdatePassword(true);
                  setDropdownOpen(false);
                }}
                className="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3"
              >
                Cập nhật mật khẩu
              </div>
            </li>
            <li onClick={logOut}>
              <div className="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3">
                Đăng xuất
              </div>
            </li>
          </ul>
        </div>
      </Transition>
      {openModalUpdatePassWord && appUserInfo.user.phone && (
        <ModalUpdatePassword
          phone={appUserInfo.user.phone}
          setOpenModalUpdatePassword={setOpenModalUpdatePassword}
        />
      )}
    </div>
  );
}

export default UserMenu;
