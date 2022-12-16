export const createBookingCode = () => {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 9; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  const newResult =
    result.slice(0, 3) + "-" + result.slice(3, 6) + "-" + result.slice(6, 9);
  return newResult;
};
