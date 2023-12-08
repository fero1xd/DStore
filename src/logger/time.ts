export const parseCurrentTime = () => {
  // Get the current date
  const currentDate = new Date();

  // Format date components
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = currentDate.getFullYear().toString().slice(-2); // Get the last two digits of the year
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  // Create the formatted date string
  const formattedDate = `${day}/${month}/${year}-${hours}:${minutes}:${seconds}`;

  return formattedDate;
};
