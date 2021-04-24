const humanize = (str) => {
  if (!str) return "";
  return str
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase();
    });
};

const prettyDate = (date) => {
  return (
    ("0" + date.getDate()).slice(-2) +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    date.getFullYear()
  );
};

const getTextFromArray = (arr) => {
  if (arr.length === 0) return "";
  let string_text = "";
  for (let i = 0; i < arr.length - 1; i++) {
    string_text += arr[i] + ", ";
  }
  string_text += arr[arr.length - 1];
  return string_text;
};

export { humanize, prettyDate, getTextFromArray };
