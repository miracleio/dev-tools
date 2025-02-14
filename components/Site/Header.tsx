"use client";

import Link from "next/link";
import SiteLogo from "@/components/Site/Logo";
// import { useUserStore } from "@/store/useUserStore";
// import AuthUserButton from "@/components/Auth/User/Button";

const SiteHeader = () => {
  // const { user } = useUserStore();
  return (
    <header className="site-header sticky top-0 z-20 w-full p-4">
      <div className="wrapper rounded-2xl w-fit border relative z-10 mx-auto flex max-w-4xl justify-center gap-4 bg-white px-4 py-2 shadow-lg shadow-gray-200 dark:bg-gray-900 dark:shadow-gray-950 border-gray-100 dark:border-gray-700">
        <Link href="/">
          <SiteLogo />
        </Link>

        {/* <nav className="site-nav">
          <div className="wrapper h-full">
            <ul className="flex h-full flex-wrap items-center gap-4">
              {!user && (
                <li className="flex items-center">
                  <Link href="/auth/login">Login</Link>
                </li>
              )}
              <li className="flex items-center">
                <AuthUserButton user={user} />
              </li>
            </ul>
          </div>
        </nav> */}
      </div>
    </header>
  );
};

export default SiteHeader;
