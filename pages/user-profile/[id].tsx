import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BookingHistory from "../../components/UserProfile/BookingHistory";
import Process from "../../components/UserProfile/Process";
import UserInfo from "../../components/UserProfile/UserInfo";
import { supabase } from "../../services/supaBaseClient";
import { Booking, Checkout, Patient } from "../../utils/types";

const UserProfilePage = () => {
  const { id } = useRouter().query;
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [user, setUser] = useState<Patient | null>(null);
  const fetchBookingOfUser = async (id: string) => {
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
  };
  const fetchCurrentUser = async (id: string) => {
    const { data: user, error } = await supabase
      .from("users")
      .select(`*`)
      .match({
        id: id,
      })
      .single();
    if (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại");
    } else if (user) {
      setUser(user);
    }
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

  useEffect(() => {
    if (bookings && bookings.length > 0 && bookings[0].status === 7) {
      fetchCheckoutOfBoking(bookings[0].id);
    }
  }, [bookings]);
  useEffect(() => {
    if (!id) return;
    if (bookings === null) fetchBookingOfUser(id as string);
    if (user === null) fetchCurrentUser(id as string);
  }, [id]);
  return (
    <>
      <Head>
        <title>Chi tiết người dùng</title>
        <meta property="og:title" content="Chain List" key="title" />
      </Head>
      <main className="max-w-screen max-h-screen p-4">
        {user && bookings && (
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
        )}
      </main>
    </>
  );
};

export default UserProfilePage;
