import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import BookingHistory from "../../components/UserProfile/BookingHistory";
import UserInfo from "../../components/UserProfile/UserInfo";
import { supabase } from "../../services/supaBaseClient";
import {
  AppUserInfo,
  Booking,
  CallData,
  Checkout,
  CouponUser,
  OmiInfo,
  User,
} from "../../utils/types";
import { useRouter } from "next/router";
import ZNSMetric from "../../components/UserProfile/ZNSMetric";
import PromotionMetric from "../../components/UserProfile/PromotionMetric";
import BookingMetrics from "../../components/UserProfile/BookingMetric";
import { RootState } from "../../redux/reducers";
import { useSelector } from "react-redux";
import { OmiAPI } from "../../api";
import CallDataInfo from "../../components/UserProfile/CallDataInfo";
import SearchBarUser from "../../components/Users/SearchUserBar";
import Classify from "../../components/UserProfile/Classify";
import ModalUpdateTag from "../../components/UserProfile/ModalUpdateTag";
import AttachFile from "../../components/UserProfile/AttachFile";
import Rating from "../../components/UserProfile/Rating";
const UserProfilePage = () => {
  const { id } = useRouter().query;
  const appUserInfo: AppUserInfo = useSelector((state: RootState) => state.admin);
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [couponsOfUser, setCouponsOfUser] = useState<CouponUser[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [omiInfo, setOmiInfo] = useState<OmiInfo | null>(null);
  const [callData, setCallData] = useState<CallData[] | null>(null);
  const [openModalUpdateTag, setOpenModalUpdateTag] = useState(false);
  const [newUpdateUser, setNewUpdateUser] = useState<User | null>(null);
  const fetchBookingOfUser = async (id: string) => {
    setIsLoading(true);
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*,clinic_id(*)")
      .match({
        patient_id: id,
      })
      .order("date", { ascending: false });
    if (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại");
    } else if (bookings) {
      setBookings(bookings);
    }
    setIsLoading(false);
  };
  const fetchCurrentUser = async (id: string) => {
    setIsLoading(true);
    const { data: user, error } = await supabase
      .from("users")
      .select("*,status(*),details_status(*),interact_type(*),interact_result(*)")
      .match({
        id: id,
      })
      .single();
    if (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại");
    } else if (user) {
      setUser(user);
    }
    setIsLoading(false);
  };
  //set checkout for the lastest booking if status 7
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const fetchCheckoutOfBoking = async (id: string) => {
    let { data: checkout_booking, error } = await supabase
      .from("checkout_booking")
      .select("*,coupons_id(*)")
      .match({ booking_id: id });
    if (checkout_booking) {
      setCheckout(checkout_booking.length > 0 ? checkout_booking[0] : null);
    }
  };
  const fetchCouponsOfUser = async (id: string) => {
    setIsLoading(true);
    let { data: coupons_user, error } = await supabase
      .from("coupons_user")
      .select("*,coupons_id(*)")
      .match({ user_id: id });
    if (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại");
    } else if (coupons_user) {
      setCouponsOfUser(coupons_user);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (bookings && bookings.length > 0 && bookings[0].status === 7) {
      fetchCheckoutOfBoking(bookings[0].id);
    }
  }, [bookings]);
  const fetchCallDataOfUser = async (phone: string) => {
    const { data: omi_calls } = await supabase
      .from("omi_calls")
      .select("*,staff_id(*)")
      .match({ customer_phone: phone })
      .order("created_date", { ascending: false });
    if (omi_calls) {
      setCallData(omi_calls);
    }
  };
  //init omicall
  const callOmi = async (domain: string, username: string, password: string) => {
    if (typeof window === "undefined") return;
    let config = {
      theme: "default", // sử dụng UI mặc định của sdk
      debug: true, // cho phép console.log các event call và trạng thái trong sdk
      busy: false, // nếu true, sẽ auto reject các cuộc gọi đến, nhưng vẫn có thể thực hiện cuộc gọi ra
      language: "vi", // Ngôn ngữ giao diện dialog,
      ringtoneVolume: 0.5,
      options: {
        showNoteInput: true, // hiển thị input note mặc định để lưu vào Omi, sẽ submit qua callback "saveCallInfo" khi cuộc gọi đã kết thúc và dialog call được đóng
        hideCallButton: false, // ẩn hiển thị nút toggle dialog nhập số để gọi ra mặc định
        showContactLoading: false, // hiển thị loading ở dialog gọi khi có cuộc gọi đến, dùng kết hợp với function omiSDK.updateContactInfo để hiển thị avatar và tên của số điện thoại gọi đến
        // maskedPhoneNumberFormat: ["start", 4, "*"], // => ****749346
        // maskedPhoneNumberFormat: ["end", 5, "x"], // => 03947xxxxx
      },
      // classes: {
      //   //custom class, được truyền vào thuộc tính class cho 2 component
      //   btnToggle: "custom-btn-toggle-call custom-abc",
      //   dialog: "custom-dialog-call",
      // },
      // styles: {
      //   //custom style được truyền dạng inline css cho 2 component
      //   btnToggle: {
      //     "background-color": "blue",
      //     justifyContent: "center",
      //     color: "red",
      //   },
      //   dialog: {
      //     "background-color": "blue",
      //     justifyContent: "center",
      //     color: "red",
      //   },
      // },
      forms: [
        // hiển thị form UI bên phải dialog trong khi call, sẽ submit qua callback "saveCallInfo" khi cuộc gọi đã kết thúc và dialog call được đóng
        {
          id: "note1",
          label: "Ghi chú 1",
          plh: "Nhập ghi chú 1",
          multiline: true,
          className: "form-note",
        },
        {
          id: "note2",
          label: "Ghi chú 2",
          multiline: true,
          plh: "Nhập ghi chú 2",
          className: "form-note",
        },
      ],
      callbacks: {
        register: (data: any) => {
          // Sự kiện xảy ra khi trạng thái kết nối tổng đài thay đổi
          console.log("register:", data);
        },
        connecting: (data: any) => {
          // Sự kiện xảy ra khi bắt đầu thực hiện cuộc gọi ra
          console.log("connecting:", data);
        },
        invite: (data: any) => {
          // Sự kiện xảy ra khi có cuộc gọi tới
          // console.log('invite:', data:any);
        },
        inviteRejected: (data: any) => {
          // Sự kiện xảy ra khi có cuộc gọi tới, nhưng bị tự động từ chối
          // trong khi đang diễn ra một cuộc gọi khác
          // console.log('inviteRejected:', data:any);
        },
        ringing: (data: any) => {
          // Sự kiện xảy ra khi cuộc gọi ra bắt đầu đổ chuông
          console.log("ringing:", data);
        },
        accepted: (data: any) => {
          // Sự kiện xảy ra khi cuộc gọi vừa được chấp nhận
          // console.log('accepted:', data);
        },
        incall: (data: any) => {
          // Sự kiện xảy ra mỗi 1 giây sau khi cuộc gọi đã được chấp nhận
          // console.log('incall:', data:any);
        },
        acceptedByOther: (data: any) => {
          // Sự kiện dùng để kiểm tra xem cuộc gọi bị kết thúc
          // đã được chấp nhận ở thiết bị khác hay không
          // console.log('acceptedByOther:', data:any);
        },
        ended: (data: any) => {
          // Sự kiện xảy ra khi cuộc gọi kết thúc
          console.log("ended:", data);
        },
        holdChanged: (status: any) => {
          // Sự kiện xảy ra khi trạng thái giữ cuộc gọi thay đổi
          // console.log('on hold:', status);
        },
        saveCallInfo: (data: any) => {
          // data:any = { callId, note, ...formData:any };
          // Sự kiện xảy ra khi cuộc gọi đã có đổ chuông hoặc cuộc gọi tới, khi user có nhập note input mặc định hoặc form input custom
          console.log("on save call info:", data);
        },
      },
    };
    (window as any).omiSDK.init(config, () => {
      let extension = {
        domain: domain,
        username: username,
        password: password,
      };
      (window as any).omiSDK.register(extension);
      // .then((data: any) => console.log("register finish!", data))
      // .catch((error: any) => {
      //   console.log("register error:", error);
      //   toast.error("Khởi tạo cuộc gọi thất bại");
      // });
    });
  };
  const getOmiInfo = async (email: string) => {
    const response = await OmiAPI.getOmiInfo(email);
    setOmiInfo(response.data);
  };
  useEffect(() => {
    if (!id) return;
    if (bookings === null) fetchBookingOfUser(id as string);
    if (user === null) fetchCurrentUser(id as string);
    if (couponsOfUser === null) fetchCouponsOfUser(id as string);
  }, [id]);
  useEffect(() => {
    if (!user) return;
    fetchCallDataOfUser(user.phone);
  }, [user]);
  //init omicall
  const initFlag = useRef(false);
  useEffect(() => {
    if (!appUserInfo) return;
    if (!initFlag.current) {
      initFlag.current = true;
      if (appUserInfo.user.email) getOmiInfo(appUserInfo.user.email);
    }
  }, [appUserInfo]);
  useEffect(() => {
    if (!omiInfo) return;
    callOmi(omiInfo.domain, omiInfo.sip_user, omiInfo.password);
  }, [omiInfo]);
  return (
    <>
      <Head>
        <title>Chi tiết người dùng</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {user && couponsOfUser && bookings && callData ? (
        <div className="flex flex-col gap-5">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="text-2xl font-bold text-slate-800">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                TRỞ LẠI TRANG TRƯỚC
              </button>
            </div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <SearchBarUser />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-bold text-slate-800">
              Chi tiết người dùng ✨
            </div>
            <div className="py-4 px-6 bg-white rounded-lg border border-slate-200">
              <UserInfo userInfo={user} bookings={bookings} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Classify
                setOpenModalUpdateTag={setOpenModalUpdateTag}
                tags={newUpdateUser?.tags || user.tags}
                group={newUpdateUser?.group || user.group}
              />
              {/* <AttachFile />
              <Rating /> */}
            </div>
            <div className="py-4 px-6 bg-white rounded-lg border border-slate-200">
              <ZNSMetric znsReceived={user.zns_received} />
            </div>
            <div className="py-4 px-6 bg-white rounded-lg border border-slate-200">
              <PromotionMetric couponsOfUser={couponsOfUser} />
            </div>
            <div className="py-4 px-6 bg-white rounded-lg border border-slate-200">
              <BookingMetrics bookings={bookings} />
            </div>

            <div className="grid grid-flow-col">
              {/* <div className="border border-slate-200 py-4 px-6 bg-white rounded-lg">
              {bookings.length > 0 ? (
                <Process booking={bookings[0]} user={user} checkout={checkout} />
              ) : (
                <div className="flex flex-col gap-4 ">
                  <div className="text-base font-bold text-slate-400">
                    Đặt hẹn gần nhất
                  </div>
                  <div>Chưa có dữ liệu</div>
                </div>
              )}
            </div> */}
              <div className="border-slate-200 py-4 px-6 bg-white rounded-lg col-span-8">
                <CallDataInfo callData={callData} />
              </div>
              <div className="border border-slate-200 py-4 px-6 bg-white rounded-lg col-span-4">
                <BookingHistory bookings={bookings} />
              </div>
            </div>
          </div>
          {openModalUpdateTag ? (
            <ModalUpdateTag
              userId={user.id}
              setOpenModal={setOpenModalUpdateTag}
              tags={newUpdateUser?.tags || user.tags}
              group={newUpdateUser?.group || user.group}
              setNewUpdateUser={setNewUpdateUser}
            />
          ) : null}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default UserProfilePage;
