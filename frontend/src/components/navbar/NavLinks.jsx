import React from "react";
import { NavLink } from "./NavLink";

export const NavLinks = () => {
  return (
    <ul className="flex gap-3 text-zinc-400 md:gap-9">
      <li>
        <NavLink href="/#features">Features</NavLink>
      </li>
      <li>
        <NavLink href="/#testimonials">Testimonials</NavLink>
      </li>
      <li>
        <NavLink href="/#pricing">Pricing</NavLink>
      </li>
      <li>
        <NavLink href="/#" external>
          Careers
        </NavLink>
      </li>
    </ul>
  );
};
