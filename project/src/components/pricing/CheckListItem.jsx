import React from "react";
import { FiCheckCircle, FiXSquare } from "react-icons/fi";

export const CheckListItem = ({ children, checked }) => {
  return (
    <div className="flex items-center gap-2 text-lg">
      {checked ? (
        <FiCheckCircle className="text-xl text-secondary" />
      ) : (
        <FiXSquare className="text-xl text-primary-content" />
      )}
      {children}
    </div>
  );
};
