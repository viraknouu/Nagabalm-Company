"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie("token");
    localStorage.clear();
    router.push("/login");
  };

  const linkClasses = (path: string) =>
    `flex items-center p-2 rounded-lg transition-colors ${
      pathname === path
        ? "bg-sky-950 text-white"
        : "text-white hover:bg-orange-500"
    }`;

  return (
    <aside className="fixed hidden md:block top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-sky-950 md:translate-x-0">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-sky-950">
        <ul className="space-y-2 font-medium">
          {/* Product */}
          <Link
            href="/dashboard/product"
            className={linkClasses("/dashboard/product")}
          >
            <svg
              className="w-5 h-5 transition duration-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span className="ml-3">Product</span>
          </Link>

          {/* Teams */}
          <Link
            href="/dashboard/teams"
            className={linkClasses("/dashboard/teams")}
          >
            <svg
              className="w-5 h-5 transition duration-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <span className="ml-3">Teams</span>
          </Link>

          {/* Location Categories */}
          <Link
            href="/dashboard/location-categories"
            className={linkClasses("/dashboard/location-categories")}
          >
            <svg
              className="w-5 h-5 transition duration-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="ml-3">Location Categories</span>
          </Link>

          {/* Locations */}
          <Link
            href="/dashboard/locations"
            className={linkClasses("/dashboard/locations")}
          >
            <svg
              className="w-5 h-5 transition duration-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="ml-3">Locations</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 rounded-lg transition-colors text-white hover:bg-red-600"
          >
            <svg
              className="w-5 h-5 transition duration-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7"
              />
            </svg>
            <span className="ml-3">Log out</span>
          </button>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
