import { Table } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import react, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ItemUser from "../../../components/ItemUser";
// import { BannerAPI } from "../../../services/api/index";
// import ItemBanner from "../../../components/itemBanner";
// import { bannersAction } from "../../../redux/actions/ReduxAction";
// import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { User } from "../../../utils/types";

function UserPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [index, setIndex] = useState<number>(0);
  const getAllUser = async () => {
    console.log("hello");
    setLoading(true);
    const { data: users, error } = await supabase.from("users").select("*");
    if (error) {
      toast.error(error.message);
      return;
    }
    console.log(users);
    if (users) {
      setUsers(users);
    }
    setLoading(false);
  };

  const initFlag = useRef(false);
  useEffect(() => {
    if (!initFlag.current) {
      initFlag.current = true;
      getAllUser();
    }
  }, []);

  return (
    <div className="h-full w-full bg-gray-50 relative overflow-y-auto ">
      <Head>
        <title>User List</title>
        <meta property="og:title" content="Banner List" key="title" />
      </Head>
      <main>
        <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5">
          <div className="mb-1 w-full">
            <div className="mb-4">
              {users && (
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {`All Users (${users.length})`}
                </h1>
              )}
            </div>
            <div className="sm:flex">
              <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
                <form className="lg:pr-3">
                  <label className="sr-only">Search</label>
                  <div className="mt-1 relative lg:w-64 xl:w-96">
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      placeholder="Search for users"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Table>
          <Table.Head>
            <Table.HeadCell>STT</Table.HeadCell>
            <Table.HeadCell>USER ID</Table.HeadCell>
            <Table.HeadCell>NAME</Table.HeadCell>
            <Table.HeadCell>PHONE</Table.HeadCell>
            <Table.HeadCell>AVATAR</Table.HeadCell>
            <Table.HeadCell className="flex justify-end">
              ACTIONS
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users
              ? users
                  .slice(index * 10, 10 + index * 10)
                  .map((user: User, _index: number) => {
                    return (
                      <ItemUser
                        item={user}
                        key={_index + index * 10}
                        index={_index}
                      />
                    );
                  })
              : null}
          </Table.Body>
        </Table>
        <div className="bg-white sticky sm:flex items-center w-full sm:justify-end bottom-0 right-0 border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            {/* <span className="text-sm font-normal text-gray-500">
              {`Showing `}
              <span className="text-gray-900 font-semibold">
                {index * 10 + 1}-{10 * index + 10}
              </span>
              {` of `}
              <span className="text-gray-900 font-semibold">
                {banners?.length}
              </span>
            </span> */}
            {/* <button
              className={
                index === 0
                  ? "opacity-70 cursor-default bg-primary flex-1 text-white font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center"
                  : "flex-1 text-white bg-primary focus:ring-4 focus:ring-green-200 font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center"
              }
              onClick={() => {
                index === 0 ? null : setIndex(index - 1);
              }}
            >
              Previous
            </button>
            <button
              className={
                index * 10 + 10 > banners?.length
                  ? "opacity-70 cursor-default bg-primary flex-1 text-white font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center"
                  : "flex-1 text-white bg-primary focus:ring-4 focus:ring-green-200 font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center"
              }
              onClick={() => {
                index * 10 + 10 > banners?.length ? null : setIndex(index + 1);
              }}
            >
              Next
            </button> */}
          </div>
        </div>
      </main>
    </div>
  );
}
export default UserPage;
