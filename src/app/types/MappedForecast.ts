export interface MappedForecast {
  date: string;
  forecastDays: ReducedForecast[];
}

export interface ReducedForecast {
  main: {
    temp: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  };
}
