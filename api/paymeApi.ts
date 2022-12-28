import requestAPI from "./requestApi";

const URL_PAYME = "/api/v1/payme";
class PaymeAPI {
  static async createQR(bookingID: string, amount: number, customerName: string) {
    try {
      const response = await requestAPI({
        url: `${URL_PAYME}/createQR`,
        method: "POST",
        data: {
          bookingID: bookingID,
          amount: amount,
          customerName: customerName,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  }
}
export default PaymeAPI;
