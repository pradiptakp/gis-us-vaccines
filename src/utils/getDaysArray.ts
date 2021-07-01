import moment from "moment";

export const getDif = (startDate: Date, endDate: Date, type: any = "days") => {
  let fromDate = moment(startDate);
  let toDate = moment(endDate);
  let diff = toDate.diff(fromDate, type);
  let range: any = {};
  for (let i = 0; i < diff; i++) {
    range[i] = moment(startDate).add(i, type).format("YYYY-MM-DD");
  }

  console.log(range);
  return range;
};
