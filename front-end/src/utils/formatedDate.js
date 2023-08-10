export function formatedDate(date) {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
