import { Table } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import react, { ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { Role } from "../../../utils/types";
import FormRole from "../../../components/Roles/create-role";
import ItemRole from "../../../components/Roles/ItemRole";
import { rolesAction } from "../../../redux/actions/ReduxAction";
import toast from "react-hot-toast";
function RolePage() {
  const roles: Role[] = useSelector((state: RootState) => state.roles);
  const dispatch = useDispatch();
  const [index, setIndex] = useState<number>(0);
  const [render, setRender] = useState<number>(0);

  const getAllRoles = async () => {
    if (!roles) {
      initFlag.current = true;
      let { data, error } = await supabase.from("roles").select("*");
      if (error) {
        toast(error.message);
        return;
      }
      if (data) {
        dispatch(rolesAction("roles", data));
      }
    }
  };
  const initFlag = useRef(false);
  useEffect(() => {
    if (!initFlag.current) {
      getAllRoles();
    }
  }, []);
  useEffect(() => {}, [roles]);
  return (
    <div className="h-full w-full bg-gray-50 relative ">
      <Head>
        <title>Chain List</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <main className="h-full">
        <div className="h-full p-4 bg-white block border-gray-200 lg:mt-1.5">
          <div className="mt-5">
            <div className="w-full md:grid md:grid-cols-2 grid-cols-1 gap-4 relative">
              <div className="relative">
                <div className="shadow rounded-lg md:absolute md:mb-0 mb-4 w-full">
                  <div className="p-4">
                    <div className="mb-1 w-full">
                      <div className="mb-4">
                        <h1 className="text-lg font-bold text-gray-900">
                          Add Role
                        </h1>
                      </div>
                    </div>
                    {roles && <FormRole roles={roles} setRender={setRender} />}
                  </div>
                </div>
              </div>
              <div className="bg-white ">
                <Table>
                  <Table.Head>
                    <Table.HeadCell>STT</Table.HeadCell>
                    <Table.HeadCell>PHONE</Table.HeadCell>
                    <Table.HeadCell>POSITION</Table.HeadCell>
                    {/* <Table.HeadCell className="flex justify-end">
                      ACTION
                    </Table.HeadCell> */}
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {roles
                      ? roles
                          .slice(index * 8, index * 8 + 8)
                          .map((chain: Role, _index: number) => {
                            return (
                              <ItemRole
                                key={index * 8 + _index}
                                item={chain}
                                index={index * 8 + _index}
                              />
                            );
                          })
                      : null}
                  </Table.Body>
                </Table>
                <div className="bg-white sticky sm:flex items-center w-full sm:justify-end mt-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-normal text-gray-500">
                      {`Showing `}
                      <span className="text-gray-900 font-semibold">
                        {index * 8 + 1}-{8 * index + 8}
                      </span>
                      {` of `}
                      {/* <span className="text-gray-900 font-semibold">
                        {chain?.length}
                      </span> */}
                    </span>
                    <button
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
                    {/* <button
                      className={
                        index * 8 + 8 > chain?.length
                          ? "opacity-70 cursor-default bg-primary flex-1 text-white font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center"
                          : "flex-1 text-white bg-primary focus:ring-4 focus:ring-green-200 font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center"
                      }
                      onClick={() => {
                        index * 8 + 8 > chain?.length
                          ? null
                          : setIndex(index + 1);
                      }}
                    >
                      Next
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {openModal && _chain ? (
          <EditChain
            chain={chain}
            _chain={_chain}
            setChain={setChain}
            setOpenModal={setOpenModal}
            indexGenre={indexGenre}
          />
        ) : null}
        {openDelete && _chain ? (
          <DeleteChain
            chain={chain}
            _chain={_chain}
            setChain={setChain}
            setOpenDelete={setOpenDelete}
            indexGenre={indexGenre}
          />
        ) : null} */}
      </main>
    </div>
  );
}
export default RolePage;
