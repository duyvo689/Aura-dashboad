import { Switch } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ModalToggleActive from "../../../../components/ModalToggleActive";
import { supabase } from "../../../../services/supaBaseClient";
import { Coupon, CouponUser, User } from "../../../../utils/types";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
function DetailCoupon() {
  const { id } = useRouter().query;
  const [couponUser, setCouponUser] = useState<CouponUser[] | null>(null);
  const [openModelAddUser, setOpenModelAddUser] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [client, setClient] = useState<User | null>();
  const [loadSerchUser, setLoadSerchUser] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [openModalToggle, setOpenModalToggle] = useState<boolean>(false);

  const [selectedToggle, setSelectedToggle] = useState<{
    id: string;
    index: number;
    active: boolean;
  } | null>(null);

  const getCouponById = async (id: string) => {
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      toast.error("Lỗi. Thử lại.");
    } else if (coupon) {
      setCoupon(coupon);
    }
  };
  const searchPhoneUser = async (value: string) => {
    setPhone(value);
    if (value.length >= 10) {
      setLoadSerchUser(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select()
          .ilike("phone", `%${value}%`);
        if (data) {
          setClient(data[0]);
        }
      } catch (error) {
      } finally {
        setLoadSerchUser(false);
      }
    } else {
      setClient(null);
    }
  };

  const getCouponUserById = async (id: any) => {
    const { data: coupon, error } = await supabase
      .from("coupons_user")
      .select("*,user_id(*),coupons_id(*)")
      .eq("coupons_id", id);
    if (error) {
      toast.error("Lỗi. Thử lại.");
    } else if (coupon) {
      setCouponUser(coupon);
    }
  };

  // const updateCouponUserById = async () => {
  //   const { data: coupon, error } = await supabase
  //       .from("coupons_user")
  //       .update({'active', selectedToggle.status})
  //           .eq("id", selectedToggle.id)
  //               .select("*,user_id(*),coupons_id(*)");
  //   if (error) {
  //     toast.error("Lỗi. Thử lại.");
  //   } else if (coupon) {
  //     setCouponUser(coupon);
  //   }
  // };

  const addCouponForUser = async (event: any) => {
    event.preventDefault();
    if (client) {
      let check = await checkCouponOfUser(id, client.id);
      if (check) {
        toast.error(`Khách hàng đã có coupon này`);
        return;
      }
      const _start_date = event.target.start_date.value;
      const _end_date = event.target.end_date.value;
      if (!_start_date || !_end_date) {
        toast.error(`Chưa chọn hạn sử dụng của coupon`);
        return;
      }
      const { data: coupon_user, error: err_coupon_user } = await supabase
        .from("coupons_user")
        .insert({
          user_id: client.id,
          coupons_id: id,
          start_date: _start_date,
          end_date: _end_date,
        })
        .select("*,user_id(*),coupons_id(*)")
        .single();
      couponUser?.push(coupon_user);
      if (err_coupon_user) {
        toast.error(err_coupon_user.message);
      }
      event.target.reset();
    }
    //Nếu chưa có khách hàng thì tạo khách hàng mới trong users -> tạo coupons cho khách hàng
    if (!client) {
      const { data: user, error: err_user } = await supabase
        .from("users")
        .insert({
          phone: phone,
        })
        .select("*")
        .single();
      if (err_user) {
        toast.error(err_user.message);
      }
      if (user) {
        const { data: coupon_user, error: err_coupon_user } = await supabase
          .from("coupons_user")
          .insert({
            user_id: user.id,
            coupons_id: id,
          })
          .select("*,user_id(*),coupons_id(*)")
          .single();
        couponUser?.push(coupon_user);
        if (err_coupon_user) {
          toast.error(err_coupon_user.message);
        }
      }
    }
    toast.success(`Đã thêm coupon cho khách hàng`);
    setOpenModelAddUser(false);
    setClient(null);
    setPhone("");
  };

  //Check xem coupon này user có chưa, nếu có rồi thì return true=> không cho thêm nữa
  const checkCouponOfUser = async (couponId: any, userId: any) => {
    const { data, error } = await supabase.from("coupons_user").select("*").match({
      coupons_id: couponId,
      user_id: userId,
      used: false,
      active: true,
    });
    if (data && data.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const updateActive = async () => {
    const { data, error } = await supabase
      .from("coupons_user")
      .update({ active: selectedToggle?.active })
      .eq("id", selectedToggle?.id)
      .select("*,user_id(*),coupons_id(*)")
      .single();
    if (couponUser && selectedToggle) {
      couponUser[selectedToggle?.index] = data;
    }
    setSelectedToggle(null);
    setOpenModalToggle(false);
  };

  useEffect(() => {
    if (!id) return;
    getCouponUserById(id as any as string);
  }, [id]);
  useEffect(() => {
    if (!id) return;
    getCouponById(id as any as string);
  }, [id]);
  return (
    <>
      <Head>
        <title>Chi tiết coupon</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Danh sách khách hàng đang sở hữu coupon (
              {couponUser ? couponUser.length : 0})
            </h1>
            {coupon && (
              <ul
                role="list"
                className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 overflow-hidden"
              >
                <li
                  key={coupon.name}
                  className="col-span-1 flex rounded-md shadow-sm overflow-hidden"
                >
                  <img src={coupon.image} className="w-16 " />
                  <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                    <div className="flex-1 truncate px-4 py-2 text-sm">
                      <p className="font-medium text-gray-900 hover:text-gray-600">
                        {coupon.name}
                      </p>
                      <p className="text-gray-500">
                        {coupon.percent ? `${coupon.percent} %` : `${coupon.price} VNĐ`}{" "}
                      </p>
                    </div>
                    <div className="flex-shrink-0 pr-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="sr-only">Open options</span>
                        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            )}
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            {coupon && coupon.tag == "client" ? (
              <button
                onClick={() => setOpenModelAddUser(true)}
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Thêm coupon cho khách hàng
              </button>
            ) : (
              coupon && (
                <Link href={`/dashboard/coupons/edit/${coupon.id}`}>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                  >
                    Chỉnh sửa coupon
                  </button>
                </Link>
              )
            )}
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                    >
                      STT
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Hình ảnh
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Tên
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Bắt đầu
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Kết thúc
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Tình trạng
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Booking sử dụng
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {couponUser && couponUser.length > 0 ? (
                    couponUser.map((item, index: number) => (
                      <tr key={index}>
                        <td className="py-4 w-[10px] pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                          {index + 1}
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-500">
                          <div className="w-16 h-16">
                            <img
                              className="w-full h-full rounded-full"
                              src={item.user_id.avatar}
                            />
                          </div>
                        </td>
                        <td className="whitespace-normal py-4 px-3 text-sm text-gray-500">
                          {item.user_id.name}
                        </td>

                        <td className="py-4 px-3  font-semibold text-sm text-green-600">
                          {item.start_date ? item.start_date : coupon?.start_date}
                        </td>
                        <td className="py-4 px-3 font-semibold text-sm text-red-600">
                          {item.end_date ? item.end_date : coupon?.end_date}
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-500 text-ellipsis overflow-hidden">
                          {item.used ? "Đã dùng" : "Chưa sử dụng"}
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-500 text-ellipsis overflow-hidden">
                          {item.booking_id ? item.booking_id : "Chưa sử dụng"}
                        </td>
                        <td className="py-4 px-3 font-semibold text-sm text-red-600">
                          <Switch
                            checked={item.active}
                            onClick={() => {
                              setSelectedToggle({
                                id: item.id,
                                index: index,
                                active: !item.active,
                              });
                              setOpenModalToggle(true);
                            }}
                            className={classNames(
                              item.active ? "bg-indigo-600" : "bg-gray-200",
                              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                item.active ? "translate-x-5" : "translate-x-0",
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                              )}
                            />
                          </Switch>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <div className="text-sm mt-6">
                      Chưa có khách hàng nào sở hữu coupon này
                    </div>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
      <Modal
        show={openModelAddUser}
        size="md"
        popup={true}
        onClose={() => setOpenModelAddUser(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={addCouponForUser}>
            <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Thêm khách hàng
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Tìm số điện thoại" />
                </div>
                <TextInput
                  id="phone"
                  placeholder="0965000xxx"
                  required={true}
                  onChange={(e) => searchPhoneUser(e.target.value)}
                />
              </div>
              {client ? (
                <div className="flex gap-4 items-center">
                  <img
                    className="w-14 h-14 rounded-full"
                    src={
                      client?.avatar
                        ? client.avatar
                        : "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
                    }
                  />
                  <div>
                    <span className="text-sm block text-gray-800">{client.name}</span>
                    <span className="text-sm block text-gray-600">{client.phone}</span>
                  </div>
                </div>
              ) : phone && !loadSerchUser ? (
                <div className="flex gap-4 col-span-2 items-center">
                  <img
                    className="w-14 h-14 rounded-full"
                    src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
                  />
                  <div>
                    <div className="flex flex-col">
                      <span className="text-sm block text-gray-600">
                        Không có thông tin
                      </span>
                      <span className="text-sm block text-gray-800 whitespace-nowrap">
                        Thao tác này sẽ tạo một khách hàng mới
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                loadSerchUser && <div className="text-gray-600">Đang tải...</div>
              )}
              <div date-rangepicker className="items-center">
                <div className="text-gray-500 my-2 text-sm">Từ ngày</div>
                <div className="relative ">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <input
                    name="start_date"
                    type="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Ngày bắt đầu"
                  />
                </div>
                <div className="text-gray-500 my-3 text-sm">Đến ngày</div>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <input
                    name="end_date"
                    type="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Ngày kết thúc"
                  />
                </div>
              </div>
              <div className="w-full">
                <Button type="submit">Thêm khách hàng</Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={openModalToggle} size="md" onClose={() => setOpenModalToggle(false)}>
        <Modal.Header>Khoá coupon của khách hàng</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 p-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Bạn có chắc là muốn thực hiện thao tác này?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateActive()}>Đồng ý</Button>
          <Button color="gray" onClick={() => setOpenModalToggle(false)}>
            Huỷ
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default DetailCoupon;
