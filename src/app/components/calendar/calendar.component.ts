import * as moment from "moment";
import { Component, OnInit } from "@angular/core";
import { InspectionsService } from "../../services/inspectionService/inspections.service";
import { WeatherService } from "../../services/weatherService/weather.service";
import { Inspection } from "../../types/Inspection";
import { Forecast } from "../../types/Forecast";
import { MappedForecast, ReducedForecast } from "src/app/types/MappedForecast";
import { HostListener } from "@angular/core";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements OnInit {
  // Inspections Data
  inspections: Inspection[];

  // Forecast Data
  forecast: MappedForecast[] = [];

  // Calendar Data
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

  // UI Columns Date Selectors
  cols = 2;

  constructor(
    private inspectionsService: InspectionsService,
    private weatherService: WeatherService
  ) {
    this.getInspections();
    this.getForecast();
  }

  ngOnInit() {
    this.initCalendar();
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.cols = window.innerWidth < 580 ? 1 : 2;
  }

  // Inspections Methods
  getInspections(): void {
    this.inspectionsService
      .getInspections()
      .subscribe(data => (this.inspections = data));
  }

  // Weather Methods
  getForecast(): void {
    this.weatherService.getForecast().subscribe(data => this.mapForecast(data));
  }

  mapForecast(forecast: Forecast) {
    const groupForecast = forecast.list.reduce((r, forecast) => {
      r[forecast.dt_txt.substr(0, 10)] = (
        r[forecast.dt_txt.substr(0, 10)] || []
      ).concat({
        main: { temp: forecast.main.temp },
        weather: { main: forecast.weather[0].main }
      });
      return r;
    }, {});

    for (var mappedForecast of Object.values<ReducedForecast[]>(
      groupForecast
    )) {
      this.forecast.push({
        date: Object.keys(groupForecast).find(
          key => groupForecast[key] === mappedForecast
        ),
        forecastDays: mappedForecast
      });
    }
  }

  getDayForecast(day: number) {
    if (day > 0 && this.forecast.length > 0) {
      const today = moment()
        .subtract(1, "days")
        .endOf("days");
      const fiveDaysAhead = moment()
        .add(5, "day")
        .endOf("days");
      const stringCalendarDate = this.generateStringDate(day);
      const calendarDate = moment(stringCalendarDate);

      if (calendarDate.isBetween(today, fiveDaysAhead)) {
        for (var dayForecast of this.forecast) {
          if (moment(dayForecast.date).isSame(calendarDate)) {
            const tempAverage = Math.round(
              dayForecast.forecastDays.reduce(
                (prevTemp, currentTemp) => prevTemp + currentTemp.main.temp,
                0
              ) / dayForecast.forecastDays.length
            );

            return `${dayForecast.forecastDays[0].weather.main} (${tempAverage}°)`;
          }
        }
      }
    }
  }

  // Fill Data Methods
  checkInspection(day: number) {
    const startDay = moment(`${this.generateStringDate(day)}`).startOf("days");

    return this.inspections.some(inspection =>
      moment(`${inspection.date}T000000`, "YYYYMMDD").isSame(startDay)
    );
  }

  // Calendar Methods
  initCalendar() {
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
    if (this.canChangeDate("month", this.selectedMonth)) {
      this.navDate.set("month", this.selectedMonth);
      this.daysList();
    }
  }

  onYearChange() {
    if (this.canChangeDate("year", this.selectedYear)) {
      this.navDate.set("year", this.selectedYear);
      this.daysList();
    }
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
    const dateStart = moment.utc(this.minYear);

    const dateEnd = moment.utc(this.maxYear);

    while (dateEnd.diff(dateStart, "years") >= 0) {
      this.years.push(dateStart.format("YYYY"));
      dateStart.add(1, "year");
    }
  }

  checkToday(day: number) {
    return moment(this.generateStringDate(day))
      .startOf("days")
      .isSame(moment().startOf("days"));
  }

  canChangeDate(type: string, newDate: string) {
    const clonedDate = moment(this.navDate);
    // @ts-ignore
    clonedDate.set(type, newDate);

    return clonedDate.isBetween(moment(this.minYear), moment(this.maxYear));
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

  generateStringDate(day: number) {
    const currentMonthNumber = moment()
      .month(this.selectedMonth)
      .format("MM");

    const mappedDay = (day + "").padStart(2, "0");

    return `${this.selectedYear}${currentMonthNumber}${mappedDay}`;
  }
}
