"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if viewport width is less than 768px
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Run on initial render
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="border-b border-solid px-4 py-4 md:px-8 flex  justify-between items-center">
      {/* LOGO */}
      <div className="flex items-center">
        <Image
          src={isMobile ? "/logo-300x150.png" : "/logo-500x100.png"}
          width={isMobile ? 140 : 200}
          height={isMobile ? 50 : 50}
          alt="Tanotado AI"
        />
      </div>

      {/* TOGGLE BUTTON */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* LINKS */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } absolute md:relative md:flex md:items-center md:gap-10  left-0 w-full bg-white md:w-auto md:bg-transparent z-50 px-4 py-4 md:p-0`}
      >
        <Link
          href="/"
          className={`block md:inline ${
            pathname === "/"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          } py-2`}
        >
          Dashboard
        </Link>
        <Link
          href="/transactions"
          className={`block md:inline ${
            pathname === "/transactions"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          } py-2`}
        >
          Transações
        </Link>
        <Link
          href="/subscription"
          className={`block md:inline ${
            pathname === "/subscription"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          } py-2`}
        >
          Plano
        </Link>
        <Link
          href="/configuracoes"
          className={`block md:inline ${
            pathname === "/configuracoes"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          } py-2`}
        >
          Configurações
        </Link>
      </div>

      {/* USER BUTTON */}
      <div className="hidden md:block">
        <UserButton showName />
      </div>
    </nav>
  );
};

export default Navbar;
