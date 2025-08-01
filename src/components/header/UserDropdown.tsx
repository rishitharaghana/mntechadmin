import { useState } from "react";
import { useNavigate } from "react-router";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link } from "react-router";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;

  // Get the first letter of the user's name in uppercase, or fallback to 'G' for Guest
  const firstLetter = userData ? userData.name.charAt(0).toUpperCase() : "G";

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleSignOut() {
    localStorage.removeItem("user");
    closeDropdown();
    navigate("/signin");
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          <span className="text-xl font-semibold text-gray-600 dark:text-gray-300">
            {firstLetter}
          </span>
        </span>
        <span className="block mr-1 font-medium text-theme-sm">
          {userData ? userData.name : "Guest"}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {userData ? (
          <>
            <div className="pl-2 pr-1 pb-2 pt-4">
              <button className="flex items-center text-gray-700 dark:text-gray-400">
                <span className="mr-3 text-3xl overflow-hidden rounded-full h-11 w-11 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <span className="text-3xl font-semibold text-gray-600 dark:text-gray-300">
                    {firstLetter}
                  </span>
                </span>
                <span className="block mr-1 font-medium text-theme-sm">
                  {userData ? userData.name : "Guest"}
                </span>
              </button>
              {/* <span className="block text-lg font-medium text-gray-700 dark:text-gray-400">
                {userData.name}
              </span>
              <span className="mt-0.5 block text-1xl text-gray-500 dark:text-gray-400">
                {userData.number}
              </span> */}
            </div>
            <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
              <li>
                <DropdownItem
                  onItemClick={closeDropdown}
                  tag="a"
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <svg
                    className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 4C9.87827 4 8.15715 5.84286 8.15715 8C8.15715 10.1571 9.87827 12 12 12C14.1217 12 15.8429 10.1571 15.8429 8C15.8429 5.84286 14.1217 4 12 4ZM6.85715 8C6.85715 5.14286 9.17143 2.7 12 2.7C14.8286 2.7 17.1429 5.14286 17.1429 8C17.1429 10.8571 14.8286 13.3 12 13.3C9.17143 13.3 6.85715 10.8571 6.85715 8ZM4.28571 18.2857C4.28571 16.0857 8.22857 14.2857 12 14.2857C15.7714 14.2857 19.7143 16.0857 19.7143 18.2857V19.3C19.7143 20.7414 18.5714 21.6 17.1429 21.6H6.85715C5.42857 21.6 4.28571 20.7414 4.28571 19.3V18.2857ZM12 15.5857C8.71429 15.5857 5.58571 17.1429 5.58571 18.2857V19.3C5.58571 19.9829 6.17143 20.3 6.85715 20.3H17.1429C17.8286 20.3 18.4143 19.9829 18.4143 19.3V18.2857C18.4143 17.1429 15.2857 15.5857 12 15.5857Z"
                      fill=""
                    />
                  </svg>
                  User Profile
                </DropdownItem>
              </li>
            </ul>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <svg
                className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                  fill=""
                />
              </svg>
              Sign out
            </button>
          </>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            <span className="block text-theme-sm">Please sign in</span>
            <Link
              to="/signin"
              className="mt-2 inline-block font-medium text-gray-700 text-theme-sm hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={closeDropdown}
            >
              Go to Sign In
            </Link>
          </div>
        )}
      </Dropdown>
    </div>
  );
}
