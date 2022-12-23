import "../styles/globals.css";
import "../styles/Sign.css";
import "../styles/Button.css";
import "../styles/Input.css";
import "../styles/globals.css";
import "../styles/additional-styles/flatpickr.css";
import "../styles/additional-styles/range-slider.css";
import "../styles/additional-styles/theme.css";
import "../styles/additional-styles/toggle-switch.css";
import "../styles/additional-styles/utility-patterns.css";
import type { AppProps } from "next/app";
import Layout from "../layout/layout";
import store from "../redux/store";
import { Provider } from "react-redux";
import Auth from "../auth/index";
// import "tippy.js/dist/tippy.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: any) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      {/* <button onClick={resetErrorBoundary}>Try again</button> */}
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Provider store={store}>
      <Auth>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster position="top-center" reverseOrder={false} />
      </Auth>
      <Script src="https://unpkg.com/flowbite@1.5.4/dist/flowbite.js"></Script>
    </Provider>
    // </ErrorBoundary>
  );
}
