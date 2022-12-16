import { Dialog, Disclosure, Menu, Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { CustomerStatus, CustomerStatusGroup, User } from "../utils/types";
import _ from "lodash";
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
  interact_type: string[];
  interact_result: string[];
}
type ObjectKey = keyof CheckedList;
const filterChecked = (userStatus: CustomerStatus | null, listStatus: string[]) => {
  if (!userStatus) return false;
  if (listStatus.length === 0) return true;
  return listStatus.includes(userStatus.id);
};
function FilterBar({ customerStatusGroup, setFilterUser, filterUser }: Props) {
  const [filterOptions, setFilterOptions] = useState<CheckedList>({
    status: [],
    details_status: [],
    interact_type: [],
    interact_result: [],
  });
  console.log(filterOptions);
  const sortOptions = [
    { name: "Phú Yên ", value: "12" },
    { name: "Đồng Tháp", value: "32" },
    { name: "Thành phố Hồ Chí Minh", value: "329" },
  ];
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
    {
      id: "interact_type",
      name: "Dạng tương tác",
      options: customerStatusGroup.interact_type,
    },
    {
      id: "interact_result",
      name: "Kết quả tưong tác",
      options: customerStatusGroup.interact_result,
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

  useEffect(() => {
    console.log("hello");
    if (
      filterOptions.status.length === 0 &&
      filterOptions.details_status.length == 0 &&
      filterOptions.interact_type.length === 0 &&
      filterOptions.interact_result.length === 0
    ) {
      setFilterUser(filterUser);
    } else {
      const newFilter = filterUser
        .filter((item) => filterChecked(item.status, filterOptions.status))
        .filter((item) =>
          filterChecked(item.details_status, filterOptions.details_status)
        )
        .filter((item) => filterChecked(item.interact_type, filterOptions.interact_type))
        .filter((item) =>
          filterChecked(item.interact_result, filterOptions.interact_result)
        );
      setFilterUser(newFilter);
    }
  }, [filterOptions]);

  return (
    <div className="bg-gray-50 z-30">
      <div className="max-w-screen px-4 text-center sm:px-6 lg:px-8">
        <section aria-labelledby="filter-heading" className=" py-3">
          <div className="flex items-center justify-between">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  {/* {filterOptions.clinic ? filterOptions.clinic.name : "Chi nhánh"} */}
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
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
                <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option, index: number) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            onClick={() => {
                              setFilterOptions((preState: any) => {
                                return {
                                  ...preState,
                                  clinic: option,
                                };
                              });
                            }}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm font-medium text-gray-900"
                            )}
                          >
                            {option.name}
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
              {filters.map((section, sectionIdx) => (
                <Popover
                  as="div"
                  key={section.name}
                  id={`desktop-menu-${sectionIdx}`}
                  className="relative inline-block text-left"
                >
                  <div>
                    <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      <span>{section.name}</span>

                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>
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
                    <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <form className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={optionIdx} className="flex items-center">
                            <input
                              id={`filter-${section.id}-${optionIdx}`}
                              name={`${option.type}`}
                              value={option.id}
                              type="checkbox"
                              checked={
                                filterOptions[option.type as ObjectKey].indexOf(
                                  option.id
                                ) === -1
                                  ? false
                                  : true
                              }
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              onChange={handlerCheckedFilter}
                            />
                            <label
                              htmlFor={`filter-${section.id}-${optionIdx}`}
                              className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                            >
                              {option.name}
                            </label>
                          </div>
                        ))}
                      </form>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              ))}
            </Popover.Group>
          </div>
        </section>
      </div>
    </div>
  );
}
export default FilterBar;
