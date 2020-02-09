import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Forecast } from "../../types/Forecast";

@Injectable({
  providedIn: "root"
})
export class WeatherService {
  private APIKey = "008a4bf02df092d4668dcc6d9704b0a7";
  private city = "Barcelona,es";
  private forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=${this.APIKey}&units=metric`;

  constructor(private http: HttpClient) {}

  getForecast(): Observable<Forecast> {
    return this.http.get<Forecast>(this.forecastURL);
  }
}
