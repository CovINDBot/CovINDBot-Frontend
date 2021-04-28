export const TWITTER_LINK = "https://twitter.com/CovINDBot";

export const GITHUB_REPOSITORY = "https://github.com/CovINDBot";

export const MAIL_LINK =
  "mailto:siddharthsingharoy@gmail.com?subject=CovidINDBot Issue";

export const AID_SERVICE_ISSUE = (uid) =>
  `mailto:siddharthsingharoy@gmail.com?subject=CovidINDBot Aid Issue&body=Aid ID : ${uid} <DO NOT CHANGE THIS>`;

export const REQUEST_SERVICE_ISSUE = (uid) =>
  `mailto:siddharthsingharoy@gmail.com?subject=CovidINDBot Request Issue&body=Request ID : ${uid} <DO NOT CHANGE THIS>`;

export const DEFAULT_FILTERS = {
  location: "kolkata",
  amenities: ["ICU", "Bed"],
  type: "Aid",
  startDate: new Date(new Date().setDate(new Date().getDate() - 14)),
  endDate: new Date(),
  locationInp: "kolkata",
};

export const RESOURCE_URL =
  "https://github.com/CovINDBot/CovINDBot-Resources#readme";
