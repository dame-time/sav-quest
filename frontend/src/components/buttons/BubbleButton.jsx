import { twMerge } from "tailwind-merge";

export const BubbleButton = ({ children, className, ...rest }) => {
  return (
    <button
      className={twMerge(
        `
            relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-md 
            border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-950
           px-3 py-1.5
           text-zinc-50 transition-all duration-300
            
            before:absolute before:inset-0
            before:-z-10 before:translate-y-[200%]
            before:scale-[2.5]
            before:rounded-[100%] before:bg-zinc-100
            before:transition-transform before:duration-500
            before:content-[""]
    
            hover:scale-105 hover:text-zinc-900
            hover:before:translate-y-[0%]
            active:scale-100`,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
