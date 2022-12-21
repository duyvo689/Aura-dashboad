import React, { useState, useRef, useEffect, SetStateAction } from "react";
import Transition from "../../../utils/components/Transition";
import { Clinic, Role } from "../../../utils/types";
interface Props {
  clinics: Clinic[];

  onFilterRoles: (idList: string[]) => void;
}
function FilterRolesBtn({ clinics, onFilterRoles }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const trigger = useRef(null);
  const dropdown = useRef(null);

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
        <span className="sr-only">Filter</span>
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
          <ul className="mb-4">
            {clinics.map((item, index: number) => {
              return (
                <li key={index} className="py-1 px-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={selectedFilter.includes(item.id)}
                      onChange={(e: any) => {
                        if (e.target.checked) {
                          setSelectedFilter((preState: any) => {
                            return [...preState, item.id];
                          });
                        } else {
                          setSelectedFilter((preState: any) => {
                            const temp = preState.filter((el: string) => el !== item.id);
                            return temp;
                          });
                        }
                      }}
                    />
                    <span className="text-sm font-medium ml-2">{item.name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="py-2 px-3 border-t border-slate-200 bg-slate-50">
            <ul className="flex items-center justify-between">
              <li>
                <button
                  onClick={() => {
                    setSelectedFilter([]);
                  }}
                  className="btn-xs bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                >
                  Loại bỏ
                </button>
              </li>
              <li>
                <button
                  className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => {
                    onFilterRoles(selectedFilter);
                    setDropdownOpen(false);
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

export default FilterRolesBtn;
