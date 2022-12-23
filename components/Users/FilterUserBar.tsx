import React, { useState, useRef, useEffect } from "react";
import Transition from "../../utils/components/Transition";
import { Category, CustomerStatus, CustomerStatusGroup, User } from "../../utils/types";
import _ from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
interface Props {
  customerStatusGroup: CustomerStatusGroup;
  setFilterUser: any;
  filterUser: User[];
}
interface CheckedList {
  status: string[];
  details_status: string[];
  //   interact_type: string[];
  //   interact_result: string[];
}
const filterChecked = (userStatus: CustomerStatus | null, listStatus: string[]) => {
  if (!userStatus) return false;
  if (listStatus.length === 0) return false;
  return listStatus.includes(userStatus.id);
};
type ObjectKey = keyof CheckedList;
function FilterUserBar({ customerStatusGroup, setFilterUser, filterUser }: Props) {
  const users: User[] = useSelector((state: RootState) => state.users);
  const [filterOptions, setFilterOptions] = useState<CheckedList>({
    status: [],
    details_status: [],
    // interact_type: [],
    // interact_result: [],
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const filters = [
    {
      id: "status",
      name: "Trạng thái KH",
      options: customerStatusGroup.status,
    },
    {
      id: "details_status",
      name: "Trạng thái chi tiết",
      options: customerStatusGroup.details_status,
    },
  ];
  const handlerCheckedFilter = (e: any) => {
    if (e.target.checked) {
      filterOptions[e.target.name as ObjectKey].push(e.target.value);
    } else {
      filterOptions[e.target.name as ObjectKey] = filterOptions[
        e.target.name as ObjectKey
      ].filter((item) => item !== e.target.value);
    }
    setFilterOptions((preState: any) => {
      preState[e.target.name as ObjectKey] = filterOptions[e.target.name as ObjectKey];
      return { ...preState };
    });
  };
  const onHanlerFilterUser = () => {
    console.log(filterOptions);
    if (
      filterOptions.status.length === 0 &&
      filterOptions.details_status.length == 0
      //   &&
      //   filterOptions.interact_type.length === 0 &&
      //   filterOptions.interact_result.length === 0
    ) {
      setFilterUser(users);
    } else {
      const newFilter1 = filterUser.filter((item) =>
        filterChecked(item.status, filterOptions.status)
      );
      const newFilter2 = filterUser.filter((item) =>
        filterChecked(item.details_status, filterOptions.details_status)
      );
      //   const newFilter3 = filterUser.filter((item) =>
      //     filterChecked(item.interact_type, filterOptions.interact_type)
      //   );
      //   const newFilter4 = filterUser.filter((item) =>
      //     filterChecked(item.interact_result, filterOptions.interact_result)
      //   );
      setFilterUser(_.uniqBy([...newFilter1, ...newFilter2], "id"));
    }
  };
  const onClearFilterUser = () => {
    setFilterOptions({
      status: [],
      details_status: [],
      //   interact_type: [],
      //   interact_result: [],
    });
    setDropdownOpen(false);
    setFilterUser(users);
  };
  // close on click outside
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(trigger);
  return (
    <div className="relative inline-flex" ref={trigger}>
      <button
        className="btn bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <wbr />
        <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
          <path d="M9 15H7a1 1 0 010-2h2a1 1 0 010 2zM11 11H5a1 1 0 010-2h6a1 1 0 010 2zM13 7H3a1 1 0 010-2h10a1 1 0 010 2zM15 3H1a1 1 0 010-2h14a1 1 0 010 2z" />
        </svg>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className="origin-top-right z-10 absolute top-full left-0 right-auto md:left-auto md:right-0 min-w-80 bg-white border border-slate-200 pt-1.5 rounded shadow-lg overflow-hidden mt-1"
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown}>
          <div className="text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-4">
            Bộ lọc
          </div>
          <div className="grid grid-cols-2 gap-1">
            {filters.map((item, index: number) => {
              return (
                <div key={index} className="py-1 px-3">
                  <div className="text-sm font-bold text-slate-500">{item.name}</div>
                  <ul className="mb-4">
                    {item.options.map((option, index: number) => {
                      return (
                        <li key={index} className="text-slate-600">
                          <label className="flex items-center">
                            <input
                              name={item.id}
                              value={option.id}
                              type="checkbox"
                              className="form-checkbox"
                              checked={
                                filterOptions[item.id as ObjectKey].indexOf(option.id) ===
                                -1
                                  ? false
                                  : true
                              }
                              onChange={handlerCheckedFilter}
                            />
                            <span className="text-sm font-medium ml-2">
                              {option.name}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="py-2 px-3 border-t border-slate-200 bg-slate-50">
            <ul className="flex items-center justify-between">
              <li>
                <button
                  onClick={onClearFilterUser}
                  className="btn-xs bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                >
                  Loại bỏ
                </button>
              </li>
              <li>
                <button
                  className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => {
                    setDropdownOpen(false);
                    onHanlerFilterUser();
                  }}
                  onBlur={() => setDropdownOpen(false)}
                >
                  Áp dụng
                </button>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default FilterUserBar;
