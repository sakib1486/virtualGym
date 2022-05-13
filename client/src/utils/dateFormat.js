export const formatDate = (date) => {
  return (
    date.toLocaleString("default", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString("en-US", { timeZone: "America/Edmonton" })
  );
};

