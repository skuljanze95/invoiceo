import { useState } from "react";

export const useHelpers = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  return {
    loading,
    open,
    setLoading,
    setOpen,
  };
};
