import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-white text-blue-600 font-semibold border-2 border-white rounded px-3 py-2 block"
      : "text-white hover:text-gray-200 px-3 py-2 block";

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-xl font-bold">
          Blog.Dev
        </Link>

        {/* Hamburger menu button for mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation links */}
        <div
          className={`flex-col md:flex-row md:flex md:items-center md:space-x-6 absolute md:static bg-blue-600 md:bg-transparent w-full md:w-auto left-0 md:left-auto top-16 md:top-auto transition-all duration-300 ease-in-out ${
            menuOpen ? "flex" : "hidden"
          } md:flex`}
        >
          <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/myposts"
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                My Blogs
              </NavLink>

              <NavLink
                to="/create"
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                Create
              </NavLink>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-white flex items-center space-x-2 px-3 py-2 w-full md:w-auto"
                >
                  <FaUserCircle size={20} />
                  <span>{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40 z-20">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
