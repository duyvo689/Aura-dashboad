import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BookingHistory from "../../components/UserProfile/BookingHistory";
import Process from "../../components/UserProfile/Process";
import UserInfo from "../../components/UserProfile/UserInfo";
import { supabase } from "../../services/supaBaseClient";
import { Booking, Checkout, CouponUser, Patient, User } from "../../utils/types";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import ZNSMetric from "../../components/UserProfile/ZNSMetric";
import PromotionMetric from "../../components/UserProfile/PromotionMetric";
import BookingMetrics from "../../components/UserProfile/BookingMetric";
const UserProfilePage = () => {
  const { id } = useRouter().query;
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [couponsOfUser, setCouponsOfUser] = useState<CouponUser[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
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
      console.log(coupons_user);
      setCouponsOfUser(coupons_user);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (bookings && bookings.length > 0 && bookings[0].status === 7) {
      fetchCheckoutOfBoking(bookings[0].id);
    }
  }, [bookings]);
  useEffect(() => {
    if (!id) return;
    if (bookings === null) fetchBookingOfUser(id as string);
    if (user === null) fetchCurrentUser(id as string);
    if (couponsOfUser === null) fetchCouponsOfUser(id as string);
  }, [id]);
  return (
    <>
      <Head>
        <title>Chi tiết người dùng</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      {user && couponsOfUser && bookings ? (
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-bold text-slate-800">Chi tiết người dùng ✨</div>
          <div className="py-4 px-6 bg-white rounded-lg border border-slate-200">
            <UserInfo userInfo={user} />
          </div>
          <div className="py-4 px-6 bg-white rounded-lg border border-slate-200">
            <ZNSMetric />
          </div>
          <div className="py-4 px-6 bg-white rounded-lg border border-slate-200">
            <PromotionMetric couponsOfUser={couponsOfUser} />
          </div>
          <div className="py-4 px-6 bg-white rounded-lg border border-slate-200">
            <BookingMetrics bookings={bookings} />
          </div>
          {bookings.length > 0 && (
            <div className="grid grid-flow-col gap-2">
              <div className="col-span-9 border border-slate-200 py-4 px-6 bg-white rounded-lg">
                <Process booking={bookings[0]} user={user} checkout={checkout} />
              </div>
              <div className="col-span-3 border border-slate-200 py-4 px-6 bg-white rounded-lg">
                <BookingHistory bookings={bookings} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>Loadinng</div>
      )}
      {/* <main className="max-w-screen max-h-screen p-4">
        {user && bookings && (
          <div className="flex flex-col gap-10">
            <div
              className="mt-4 sm:mt-0 flex items-center cursor-pointer"
              onClick={() => {
                router.back();
              }}
            >
              <ChevronLeftIcon className="w-6 h-6" />
              <div className="text-base font-normal">Trở về trang trước</div>
            </div>

            <div className="grid 2xl:grid-cols-6 lg:grid-cols-4  gap-4 relative">
              <div className="col-span-1 sticky top-0">
                <UserInfo userInfo={user} />
              </div>
              <div className="2xl:col-span-4 lg:col-span-2">
                <div className="max-w-full max-h-screen overflow-y-auto flex justify-center">
                  {bookings.length > 0 ? (
                    <Process booking={bookings[0]} user={user} checkout={checkout} />
                  ) : (
                    <div className="flex justify-center col-span-4">
                      Khách hàng chưa có booking
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-1 sticky top-0 ">
                {bookings.length > 0 ? <BookingHistory bookings={bookings} /> : null}
              </div>
            </div>
          </div>
        )}
      </main> */}
    </>
  );
};

export default UserProfilePage;
