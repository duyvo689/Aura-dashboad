// const mainApi = `http://localhost:3001`;
const mainApi = process.env.NEXT_PUBLIC_API as string;
// // const mainApi = "https://cb4b-2001-ee0-520b-40e0-99a4-c832-2133-e0ca.ap.ngrok.io";
export { mainApi };
