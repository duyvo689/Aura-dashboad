import Head from "next/head";

export interface FortgotPasswordProps {}

export default function ForgotPasswordPage(props: FortgotPasswordProps) {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Check Email</title>
        <meta property="og:title" content="Confirm email page" key="title" />
      </Head>
      <main className="flex-grow z-0">
        <section className="relative">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="font-extrabold title-sign">
                  Please check your email to verify your account
                </h1>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
