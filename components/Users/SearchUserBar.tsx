import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { User } from "../../utils/types";
import moment from "moment";
import { supabase } from "../../services/supaBaseClient";
import Link from "next/link";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function SearchUserBar() {
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
    <div>
      <div className="relative">
        <input
          type="text"
          name="search"
          id="search"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          placeholder="Tìm kiếm số theo tên"
          className="form-input pl-9 text-slate-500 hover:text-slate-600 font-medium focus:border-slate-300 min-w-[700px]"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
          <MagnifyingGlassIcon stroke={"#64748b"} className="w-6 h-5" />
        </div>
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
