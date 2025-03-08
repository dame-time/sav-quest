import Link from "next/link";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";

export const NavLink = ({ children, external, href = "#" }) => {
  return (
    <Link
      href={href}
      rel="nofollow"
      target={external ? "_blank" : undefined}
      className="group flex items-center gap-0.5 text-xs text-zinc-200 transition-colors hover:text-zinc-50 sm:text-sm"
    >
      <span>{children}</span>
      {external && (
        <FiArrowUpRight className="block transition-transform group-hover:rotate-45" />
      )}
    </Link>
  );
};
