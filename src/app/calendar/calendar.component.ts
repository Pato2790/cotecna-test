import { Component, OnInit } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements OnInit {
  localeString: string = "en";
  navDate: any;
  weekDays: Array<string> = [];
  monthsYear: Array<string> = [];
  years: Array<string> = [];
  grid: Array<any> = [];

  selectedMonth: string;
  selectedYear: string;

  minYear = "2010";
  maxYear = "2030";

  constructor() {}

  ngOnInit() {
    moment.locale(this.localeString);
    this.navDate = moment();
    this.selectedMonth = this.navDate.format("MMMM");
    this.selectedYear = this.navDate.format("YYYY");
    this.daysNamesList();
    this.daysList();
    this.monthsList();
    this.yearsList();
  }

  onMonthChange() {
    if (this.canChangeDate('month', this.selectedMonth)) {
      this.navDate.set('month', this.selectedMonth);
      this.daysList();
    }
  }

  onYearChange() {
    if (this.canChangeDate('year', this.selectedYear)) {
      this.navDate.set('year', this.selectedYear);
      this.daysList();
    }
  }

  canChangeDate(type: string, newDate: string) {
    const clonedDate = moment(this.navDate);
    // @ts-ignore
    clonedDate.set(type, newDate);

    return clonedDate.isBetween(moment(this.minYear), moment(this.maxYear));
  }

  daysNamesList() {
    const weekDaysArr: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArr.forEach(day =>
      this.weekDays.push(
        moment()
          .weekday(day)
          .format("ddd")
      )
    );
  }

  daysList() {
    this.grid = [];

    const firstDayDate = moment(this.navDate).startOf("month");
    const initialEmptyCells = firstDayDate.weekday();
    const lastDayDate = moment(this.navDate).endOf("month");
    const lastEmptyCells = 6 - lastDayDate.weekday();
    const daysInMonth = this.navDate.daysInMonth();
    const arrayLength = initialEmptyCells + lastEmptyCells + daysInMonth;

    for (let i = 0; i < arrayLength; i++) {
      let obj: any = {};
      if (i < initialEmptyCells || i > initialEmptyCells + daysInMonth - 1) {
        obj.value = 0;
        obj.available = false;
      } else {
        obj.value = i - initialEmptyCells + 1;
        obj.available = this.isAvailable(i - initialEmptyCells + 1);
      }
      this.grid.push(obj);
    }
  }

  monthsList() {
    this.monthsYear.push(...moment.months());
  }

  yearsList() {
    const dateStart = moment(this.minYear);
    // @ts-ignore
    const dateEnd = moment().set('year', this.maxYear);

    while (dateEnd.diff(dateStart, "years") >= 0) {
      this.years.push(dateStart.format("YYYY"));
      dateStart.add(1, "year");
    }
  }

  isAvailable(num: number): boolean {
    let dateToCheck = this.dateFromNum(num, this.navDate);
    if (dateToCheck.isBefore(moment(), "day")) {
      return false;
    } else {
      return true;
    }
  }

  dateFromNum(num: number, referenceDate: any): any {
    let returnDate = moment(referenceDate);
    return returnDate.date(num);
  }
}