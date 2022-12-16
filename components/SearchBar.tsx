import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { User } from "../utils/types";
import moment from "moment";
import { supabase } from "../services/supaBaseClient";
import Link from "next/link";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [filterUsers, setFilterUsers] = useState<User[] | null>(null);
  const getBookingByFilter = async () => {
    let { data: users, error } = await supabase
      .from("users")
      .select("*")
      .or(`name.ilike.%${keyword.trim()}%,phone.ilike.${keyword.trim()}%`);
    if (error) {
      return;
    } else if (users) {
      setFilterUsers(users);
    }
  };
  useEffect(() => {
    if (keyword === "") {
      setFilterUsers(null);
      return;
    }
    let timer = setTimeout(getBookingByFilter, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [keyword]);
  return (
    <div className="mb-10">
      <div className="relative max-w-[700px]">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          value={keyword}
          className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
      </div>
      {filterUsers !== null && (
        <ul className="absolute z-50 mt-1 max-h-56 min-w-[700px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filterUsers.length <= 0 ? (
            <li className="text-gray-900 text-center relative cursor-default select-none py-2 pl-3 pr-9">
              Không tìm thấy kết quả
            </li>
          ) : (
            filterUsers.map((item: User, index) => (
              <li
                key={index}
                className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-slate-200"
                onClick={() => {
                  setKeyword("");
                }}
              >
                <Link href={`/user-profile/${item.id}`}>
                  <div className="flex gap-2 items-center">
                    <img
                      className="w-10 h-10"
                      src={item.avatar ? item.avatar : "../images/default-avatar.png"}
                      alt={item.name}
                    />
                    <div className="flex flex-col">
                      <span
                        className={classNames(
                          "text-sm font-normal ",
                          "ml-3 block truncate"
                        )}
                      >
                        {item.name}
                      </span>
                      <span
                        className={classNames(
                          "text-sm font-normal",
                          "ml-3 block truncate"
                        )}
                      >
                        SĐT:{item.phone}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={classNames(
                          "text-sm font-normal",
                          "ml-3 block truncate"
                        )}
                      >
                        {moment(item.created_at).format("DD/MM/YYYY")}
                      </span>
                      <span
                        className={classNames(
                          "text-sm font-normal",
                          "ml-3 block truncate"
                        )}
                      >
                        {item.id}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
