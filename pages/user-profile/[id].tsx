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
      toast.error("C?? l???i x???y ra. Vui l??ng th??? l???i");
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
      toast.error("C?? l???i x???y ra. Vui l??ng th??? l???i");
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
      toast.error("C?? l???i x???y ra. Vui l??ng th??? l???i");
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
      theme: "default", // s??? d???ng UI m???c ?????nh c???a sdk
      debug: true, // cho ph??p console.log c??c event call v?? tr???ng th??i trong sdk
      busy: false, // n???u true, s??? auto reject c??c cu???c g???i ?????n, nh??ng v???n c?? th??? th???c hi???n cu???c g???i ra
      language: "vi", // Ng??n ng??? giao di???n dialog,
      ringtoneVolume: 0.5,
      options: {
        showNoteInput: true, // hi???n th??? input note m???c ?????nh ????? l??u v??o Omi, s??? submit qua callback "saveCallInfo" khi cu???c g???i ???? k???t th??c v?? dialog call ???????c ????ng
        hideCallButton: false, // ???n hi???n th??? n??t toggle dialog nh???p s??? ????? g???i ra m???c ?????nh
        showContactLoading: false, // hi???n th??? loading ??? dialog g???i khi c?? cu???c g???i ?????n, d??ng k???t h???p v???i function omiSDK.updateContactInfo ????? hi???n th??? avatar v?? t??n c???a s??? ??i???n tho???i g???i ?????n
        // maskedPhoneNumberFormat: ["start", 4, "*"], // => ****749346
        // maskedPhoneNumberFormat: ["end", 5, "x"], // => 03947xxxxx
      },
      // classes: {
      //   //custom class, ???????c truy???n v??o thu???c t??nh class cho 2 component
      //   btnToggle: "custom-btn-toggle-call custom-abc",
      //   dialog: "custom-dialog-call",
      // },
      // styles: {
      //   //custom style ???????c truy???n d???ng inline css cho 2 component
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
        // hi???n th??? form UI b??n ph???i dialog trong khi call, s??? submit qua callback "saveCallInfo" khi cu???c g???i ???? k???t th??c v?? dialog call ???????c ????ng
        {
          id: "note1",
          label: "Ghi ch?? 1",
          plh: "Nh???p ghi ch?? 1",
          multiline: true,
          className: "form-note",
        },
        {
          id: "note2",
          label: "Ghi ch?? 2",
          multiline: true,
          plh: "Nh???p ghi ch?? 2",
          className: "form-note",
        },
      ],
      callbacks: {
        register: (data: any) => {
          // S??? ki???n x???y ra khi tr???ng th??i k???t n???i t???ng ????i thay ?????i
          console.log("register:", data);
        },
        connecting: (data: any) => {
          // S??? ki???n x???y ra khi b???t ?????u th???c hi???n cu???c g???i ra
          console.log("connecting:", data);
        },
        invite: (data: any) => {
          // S??? ki???n x???y ra khi c?? cu???c g???i t???i
          // console.log('invite:', data:any);
        },
        inviteRejected: (data: any) => {
          // S??? ki???n x???y ra khi c?? cu???c g???i t???i, nh??ng b??? t??? ?????ng t??? ch???i
          // trong khi ??ang di???n ra m???t cu???c g???i kh??c
          // console.log('inviteRejected:', data:any);
        },
        ringing: (data: any) => {
          // S??? ki???n x???y ra khi cu???c g???i ra b???t ?????u ????? chu??ng
          console.log("ringing:", data);
        },
        accepted: (data: any) => {
          // S??? ki???n x???y ra khi cu???c g???i v???a ???????c ch???p nh???n
          // console.log('accepted:', data);
        },
        incall: (data: any) => {
          // S??? ki???n x???y ra m???i 1 gi??y sau khi cu???c g???i ???? ???????c ch???p nh???n
          // console.log('incall:', data:any);
        },
        acceptedByOther: (data: any) => {
          // S??? ki???n d??ng ????? ki???m tra xem cu???c g???i b??? k???t th??c
          // ???? ???????c ch???p nh???n ??? thi???t b??? kh??c hay kh??ng
          // console.log('acceptedByOther:', data:any);
        },
        ended: (data: any) => {
          // S??? ki???n x???y ra khi cu???c g???i k???t th??c
          console.log("ended:", data);
        },
        holdChanged: (status: any) => {
          // S??? ki???n x???y ra khi tr???ng th??i gi??? cu???c g???i thay ?????i
          // console.log('on hold:', status);
        },
        saveCallInfo: (data: any) => {
          // data:any = { callId, note, ...formData:any };
          // S??? ki???n x???y ra khi cu???c g???i ???? c?? ????? chu??ng ho???c cu???c g???i t???i, khi user c?? nh???p note input m???c ?????nh ho???c form input custom
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
      //   toast.error("Kh???i t???o cu???c g???i th???t b???i");
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
        <title>Chi ti???t ng?????i d??ng</title>
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
                TR??? L???I TRANG TR?????C
              </button>
            </div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <SearchBarUser />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-bold text-slate-800">
              Chi ti???t ng?????i d??ng ???
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
                    ?????t h???n g???n nh???t
                  </div>
                  <div>Ch??a c?? d??? li???u</div>
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
