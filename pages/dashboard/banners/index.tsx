import { Table } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import react, { ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers";
import { supabase } from "../../../services/supaBaseClient";
import { Banner } from "../../../utils/types";
import FormBanner from "../../../components/Banners/create-banner";
import { bannersAction } from "../../../redux/actions/ReduxAction";
import toast from "react-hot-toast";
import ItemRole from "../../../components/Roles/ItemRole";
import ItemBanner from "../../../components/Banners/ItemBanner";
function RolePage() {
  const banners: Banner[] = useSelector((state: RootState) => state.banners);
  const dispatch = useDispatch();
  const [index, setIndex] = useState<number>(0);
  // const [render, setRender] = useState<number>(0);
  const getAllBanner = async () => {
    if (!banners) {
      initFlag.current = true;
      let { data, error } = await supabase.from("banners").select("*");
      if (error) {
        toast(error.message);
        return;
      }
      if (data) {
        dispatch(bannersAction("banners", data));
      }
    }
  };
  const initFlag = useRef(false);
  useEffect(() => {
    if (!initFlag.current) {
      getAllBanner();
    }
  }, []);
  useEffect(() => {}, [banners]);
  return (
    <div className="h-full w-full bg-gray-50 relative ">
      <Head>
        <title>Chain List</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {banners ? (
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
                            Thêm Banner
                          </h1>
                        </div>
                      </div>
                      <FormBanner banners={banners} />
                    </div>
                  </div>
                </div>
                <div className="bg-white ">
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>STT</Table.HeadCell>
                      <Table.HeadCell>Ảnh</Table.HeadCell>
                      <Table.HeadCell>Thứ tự sắp xếp</Table.HeadCell>
                      {/* <Table.HeadCell className="flex justify-end">
                        Thao tác
                      </Table.HeadCell> */}
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {banners
                        ? banners
                            .slice(index * 8, index * 8 + 8)
                            .map((banner: Banner, _index: number) => {
                              return (
                                <ItemBanner
                                  key={index * 8 + _index}
                                  item={banner}
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
                        {` Hiển thị `}
                        <span className="text-gray-900 font-semibold">
                          {index * 8 + 1}-{8 * index + 8}
                        </span>
                        {` trên `}
                        <span className="text-gray-900 font-semibold">
                          {banners?.length}
                        </span>
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
                        Trước
                      </button>
                      <button
                        className={
                          index * 8 + 8 > banners?.length
                            ? "opacity-70 cursor-default bg-primary flex-1 text-white font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center"
                            : "flex-1 text-white bg-primary focus:ring-4 focus:ring-green-200 font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center"
                        }
                        onClick={() => {
                          index * 8 + 8 > banners?.length
                            ? null
                            : setIndex(index + 1);
                        }}
                      >
                        Sau
                      </button>
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
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
export default RolePage;
