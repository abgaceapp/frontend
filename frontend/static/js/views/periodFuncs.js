export function getPeriod(month, day, year) {
  // Returns [Period, Week of Period, Fiscal Year]

  switch (month) {
    case 0:
      // January
      if (year == 2023) {
        if (day < 7) {
          return [10, 4, 23, "Dec 31 - Jan 7"];
        } else if (day >= 7 && day < 14) {
          return [11, 1, 23, "Jan 7 - Jan 13"];
        } else if (day >= 14 && day < 21) {
          return [11, 2, 23, "Jan 14 - Jan 21"];
        } else if (day >= 21 && day < 28) {
          return [11, 3, 23, "Jan 21 - Jan 28"];
        } else if (day >= 28) {
          return [11, 4, 23, "Jan 28 - Feb 4"];
        }
      }
      break;

    case 1:
      // February
      if (year == 2023) {
        if (day < 4) {
          return [11, 4, 23, "Jan 28 - Feb 4"];
        } else if (day >= 4 && day < 11) {
          return [12, 1, 23, "Feb 4 - Feb 11"];
        } else if (day >= 11 && day < 18) {
          return [12, 2, 23, "Feb 11 - Feb 18"];
        } else if (day >= 18 && day < 25) {
          return [12, 3, 23, "Feb 18 - Feb 25"];
        } else if (day >= 25) {
          return [12, 4, 23, "Feb 25 - March 4"];
        }
      }
      break;

    case 2:
      // March
      if (year == 2022) {
        if (day >= 5 && day < 12) {
          return [13, 1, 22, "March 5 - March 12"];
        } else if (day >= 12 && day < 19) {
          return [13, 2, 22, "March 12 - March 19"];
        } else if (day >= 19 && day < 26) {
          return [13, 3, 22, "March 19 - March 26"];
        } else if (day >= 26) {
          return [13, 4, 22, "March 26 - April 2"];
        }

      } else if (year == 2023) {
        if (day < 4) {
          return [12, 4, 23, "Feb 25 - March 4"];
        } else if (day >= 4 && day < 11) {
          return [13, 1, 23, "March 4 - March 11"];
        } else if (day >= 11 && day < 18) {
          return [13, 2, 23, "March 11 - March 18"];
        } else if (day >= 18 && day < 25) {
          return [13, 3, 23, "March 18 - March 25"];
        } else if (day >= 25) {
          return [13, 4, 23, "March 25 - April 2"];
        }
      }
      break;

    case 3:
      // April
      if (year == 2022) {
        if (day < 2) {
          return [13, 4, 22, "March 25 - April 2"];
        } else if (day >= 2 && day < 9) {
          return [1, 1, 23, "April 2 - April 9"];
        } else if (day >= 9 && day < 16) {
          return [1, 2, 23, "April 9 - April 16"];
        } else if (day >= 16 && day < 23) {
          return [1, 3, 23, "April 16 - April 23"];
        } else if (day >= 23 && day < 30) {
          return [1, 4, 23, "April 23 - April 30"];
        } else if (day >= 30) {
          return [2, 1, 23, "April 30 - May 7"];
        }

      } else if (year == 2023) {

      }
      break;

    case 4:
      // May
      if (year == 2022) {
        if (day < 7) {
          return [2, 1, 23, "April 30 - May 7"];
        } else if (day >= 7 && day < 14) {
          return [2, 2, 23, "May 7 - May 14"];
        } else if (day >= 14 && day < 21) {
          return [2, 3, 23, "May 14 - May 21"];
        } else if (day >= 21 && day < 28) {
          return [2, 4, 23, "May 21 - May 28"];
        } else if (day >= 28) {
          return [3, 1, 23, "May 28 - June 4"];
        }
      } else if (year == 2023) {

      }
      break;

    case 5:
      // June
      if (year == 2022) {
        if (day < 4) {
          return [3, 1, 23, "May 28 - June 4"];
        } else if (day >= 4 && day < 11) {
          return [3, 2, 23, "June 4 - June 11"];
        } else if (day >= 11 && day < 18) {
          return [3, 3, 23, "June 11 - June 18"];
        } else if (day >= 18 && day < 25) {
          return [3, 4, 23, "June 18 - June 25"];
        } else if (day >= 25) {
          return [4, 1, 23, "June 25 - July 2"];
        }
      } else if (year == 2023) {

      }
      break;

    case 6:
      // July
      if (year == 2022) {
        if (day < 2) {
          return [4, 1, 23, "June 25 - July 2"];
        } else if (day >= 2 && day < 9) {
          return [4, 2, 23, "July 2 - July 9"];
        } else if (day >= 9 && day < 16) {
          return [4, 3, 23, "July 9 - July 16"];
        } else if (day >= 16 && day < 23) {
          return [4, 4, 23, "July 16 - July 23"];
        } else if (day >= 23 && day < 30) {
          return [5, 1, 23, "July 23 - July 30"];
        } else if (day >= 30) {
          return [5, 2, 23, "July 30 - Aug 6"];
        }
      } else if (year == 2023) {

      }
      break;

    case 7:
      // August
      if (year == 2022) {
        if (day < 6) {
          return [5, 2, 23, "July 30 - Aug 6"];
        } else if (day >= 6 && day < 13) {
          return [5, 3, 23, "Aug 6 - Aug 13"];
        } else if (day >= 13 && day < 20) {
          return [5, 4, 23, "Aug 13 - Aug 20"];
        } else if (day >= 20 && day < 27) {
          return [6, 1, 23, "Aug 20 - Aug 27"];
        } else if (day >= 27) {
          return [6, 2, 23, "Aug 27 - Sept 3"];
        }
      } else if (year == 2023) {

      }
      break;

    case 8:
      // September
      if (year == 2022) {
        if (day < 3) {
          return [6, 2, 23, "Aug 27 - Sept 3"];
        } else if (day >= 3 && day < 10) {
          return [6, 3, 23, "Sept 3 - Sept 10"];
        } else if (day >= 10 && day < 17) {
          return [6, 4, 23, "Sept 10 - Sept 17"];
        } else if (day >= 17 && day < 24) {
          return [7, 1, 23, "Sept 17 - Sept 24"];
        } else if (day >= 24) {
          return [7, 2, 23, "Sept 24 - Oct 1"];
        }
      } else if (year == 2023) {

      }
      break;

    case 9:
      // October
      if (year == 2022) {
        if (day >= 1 && day < 8) {
          return [7, 3, 23, "Oct 1 - Oct 8"];
        } else if (day >= 8 && day < 15) {
          return [7, 4, 23, "Oct 8 - Oct 15"];
        } else if (day >= 15 && day < 22) {
          return [8, 1, 23, "Oct 15 - Oct 22"];
        } else if (day >= 22 && day < 29) {
          return [8, 2, 23, "Oct 22 - Oct 29"];
        } else if (day >= 29) {
          return [8, 3, 23, "Oct 29 - Nov 5"];
        }
      } else if (year == 2023) {

      }
      break;

    case 10:
      // November
      if (year == 2022) {
        if (day < 5) {
          return [8, 3, 23, "Oct 29 - Nov 5"];
        } else if (day >= 5 && day < 12) {
          return [8, 4, 23, "Nov 5 - Nov 12"];
        } else if (day >= 12 && day < 19) {
          return [9, 1, 23, "Nov 12 - Nov 19"];
        } else if (day >= 19 && day < 26) {
          return [9, 2, 23, "Nov 19 - Nov 26"];
        } else if (day >= 26) {
          return [9, 3, 23, "Nov 26 - Dec 3"];
        }
      } else if (year == 2023) {

      }
      break;

    case 11:
      // December
      if (year == 2022) {
        if (day < 3) {
          return [9, 3, 23, "Nov 26 - Dec 3"];
        } else if (day >= 3 && day < 10) {
          return [9, 4, 23, "Dec 3 - Dec 10"];
        } else if (day >= 10 && day < 17) {
          return [10, 1, 23, "Dec 10 - Dec 17"];
        } else if (day >= 17 && day < 24) {
          return [10, 2, 23, "Dec 17 - Dec 24"];
        } else if (day >= 24 && day < 31) {
          return [10, 3, 23, "Dec 24 - Dec 31"];
        } else if (day >= 31) {
          return [10, 4, 23, "Dec 31 - Jan 7"];
        }
      } else if (year == 2023) {

      }
      break;

    default:
      console.log("DATE OBJECT ERROR!");
      break;
  }
}

export function roundToTwo(num) {
    const number = +(Math.round(num + "e+2")  + "e-2");
    return number.toFixed(0);
    //return number.toFixed(2);
}

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
