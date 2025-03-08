import React from "react";
import { FiMail } from "react-icons/fi";

export const EmailCapture = () => {
  return (
    <section className="relative bg-background py-24 text-copy">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-2 md:flex-row md:px-4">
        <div>
          <h2 className="mb-2 text-center text-3xl font-medium md:text-start">
            Get Financial Tips & Updates
          </h2>
          <p className="text-center text-lg text-copy-lighter md:text-start">
            Unlock new ways to save more, invest better, and level up your money habits.
          </p>
          <p className="text-center text-lg text-copy-lighter md:text-start">
            Sign up for insider tips, no spam, ever.
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full max-w-sm items-center gap-1.5"
        >
          <input
            type="email"
            placeholder="Your email address"
            className="h-fit w-full rounded-md border border-border bg-foreground px-3 py-2 transition-colors focus:border-primary-light focus:outline-none"
          />
          <button
            type="submit"
            className="grid size-10 shrink-0 place-content-center rounded-md bg-primary text-xl text-zinc-900 transition-colors hover:bg-primary-dark"
          >
            <FiMail className="text-primary-content" />
          </button>
        </form>
      </div>

      {/* Decorative top/bottom bars */}
      <div className="absolute left-0 right-0 top-0 h-8 rounded-b-2xl bg-foreground" />
      <div className="absolute bottom-0 left-0 right-0 h-8 rounded-t-2xl bg-foreground" />
    </section>
  );
};