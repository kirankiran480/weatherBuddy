import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HomePage } from './home.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { doesNotReject } from 'assert';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: Geolocation, useValue: { watchPosition: () => of({ coords: { latitude: 12, longitude: 12 } }) } },
      { provide: HttpClient, useValue: { get: (url) => new Observable() } }, {
        provide: LoadingController,
        useValue: {
          create: () => Promise.resolve({
            present: () => { }, dismiss: () => () => { }
          }),
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get weather data', async () => {
    const currentLocation = { latitude: 12, longitude: 13 };
    const http = TestBed.get(HttpClient);
    spyOn(http, 'get').and.returnValue(of({
      coord: { lon: -0.13, lat: 51.51 },
      weather: [{ id: 300, main: 'Drizzle', description: 'light intensity drizzle', icon: '09d' }],
      base: 'stations', main: { temp: 280.32, pressure: 1012, humidity: 81, temp_min: 279.15, temp_max: 281.15 },
      visibility: 10000, wind: { speed: 4.1, deg: 80 }, clouds: { all: 90 }, dt: 1485789600,
      sys: { type: 1, id: 5091, message: 0.0103, country: 'GB', sunrise: 1485762037, sunset: 1485794875 },
      id: 2643743, name: 'London', cod: 200
    }));
    await component.getWeatherData(currentLocation);
    expect(component.weatherResponse.weather[0].id).toBe(300);
  });
});
