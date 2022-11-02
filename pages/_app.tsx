import "../styles/globals.css";
import "../styles/Sign.css";
import "../styles/Button.css";
import "../styles/Input.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../layout/layout";
import store from "../redux/store";
import { Provider } from "react-redux";
import Auth from "../auth/index";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Auth>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster position="top-center" reverseOrder={false} />
      </Auth>
    </Provider>
  );
}
