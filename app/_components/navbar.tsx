"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="flex justify-between border-b border-solid px-8 py-4">
      {/* ESQUERDA */}
      <div className="flex items-center gap-10">
        <Image src="/logo.svg" width={153} height={39} alt="Tanotado AI" />
        <Link
          href="/"
          className={
            pathname === "/"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Dashboard
        </Link>
        <Link
          href="/transactions"
          className={
            pathname === "/transactions"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Transações
        </Link>
        <Link
          href="/subscription"
          className={
            pathname === "/subscription"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Plano
        </Link>
        <Link
          href="/configuracoes"
          className={
            pathname === "/configuracoes"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Configurações
        </Link>
      </div>
      {/* DIREITA */}
      <UserButton showName />
    </nav>
  );
};

export default Navbar;
