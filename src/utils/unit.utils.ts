export const timeToDate = (fullDate: Date) => {
  return fullDate.toISOString().slice(0, 10);
};
