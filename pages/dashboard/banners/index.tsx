import { Table } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import react, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { BannerAPI } from "../../../services/api/index";
// import ItemBanner from "../../../components/itemBanner";
// import { bannersAction } from "../../../redux/actions/ReduxAction";
// import { RootState } from "../../../redux/reducers";
// import { Banner } from "../../../types/types";

function BannerPage() {
  //   const banners: Banner[] = useSelector((state: RootState) => state.banners);
  //   const dispatch = useDispatch();
  const [index, setIndex] = useState<number>(0);

  //   const getAllGame = async () => {
  //     if (!banners) {
  //       const response = await BannerAPI.getAllBanner();
  //       if (response && response.data.status === "Success") {
  //         dispatch(bannersAction("banner", response.data.data));
  //       }
  //     }
  //   };

  //   useEffect(() => {
  //     getAllGame();
  //   }, []);
  //   useEffect(() => {}, [banners]);
  return (
    <div className="h-full w-full bg-gray-50 relative overflow-y-auto ">
      <Head>
        <title>Banner List</title>
        <meta property="og:title" content="Banner List" key="title" />
      </Head>
      <main>
        <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5">
          <div className="mb-1 w-full">
            {/* <div className="mb-4">
              {banners && (
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {`All Banners (${banners.length})`}
                </h1>
              )}
            </div> */}
            <div className="sm:flex">
              <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
                <form className="lg:pr-3">
                  <label className="sr-only">Search</label>
                  <div className="mt-1 relative lg:w-64 xl:w-96">
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      placeholder="Search for banners"
                    />
                  </div>
                </form>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                <Link href="/dashboard/banner/create-banner">
                  <button className="w-1/2 text-white bg-primary focus:ring-4 focus:ring-green-200 font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add New Banner
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Table>
          <Table.Head>
            <Table.HeadCell>STT</Table.HeadCell>
            <Table.HeadCell>THUMBNAIL</Table.HeadCell>
            <Table.HeadCell>NAME</Table.HeadCell>
            <Table.HeadCell>DESCRIPTION</Table.HeadCell>
            <Table.HeadCell>STATUS</Table.HeadCell>
            <Table.HeadCell className="flex justify-end">
              ACTIONS
            </Table.HeadCell>
          </Table.Head>
          {/* <Table.Body className="divide-y">
            {banners
              ? banners
                  .slice(index * 10, 10 + index * 10)
                  .map((banner: Banner, _index: number) => {
                    return (
                      <ItemBanner
                        banner={banner}
                        key={_index + index * 10}
                        index={index}
                      />
                    );
                  })
              : null}
          </Table.Body> */}
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
export default BannerPage;
