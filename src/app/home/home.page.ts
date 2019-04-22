import { Component, OnInit, OnDestroy } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { interval } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  currentLocation: any;
  weatherResponse: any;
  isOnline: boolean;
  disconnectSubscription: any;
  connectSubscription: any;
  positionWatch: any;
  pollingData: any;
  constructor(private geoLocation: Geolocation,
    private http: HttpClient, public loadingController: LoadingController,
    private network: Network,
  ) {
    this.isOnline = true;
  }
  ngOnInit() {

    this.positionWatch = this.geoLocation.watchPosition();
    this.positionWatch.subscribe((data) => {
      if (!this.currentLocation ||
        (this.currentLocation.latitude !== data.coords.latitude && this.currentLocation.longitude !== data.coords.longitude)) {
        this.currentLocation = data.coords;
        this.getWeatherData(this.currentLocation);
      }
    });

    this.pollingData = interval(60000).subscribe(() => {
      if (this.currentLocation) {
        this.getWeatherData(this.currentLocation);
      }
    });
  }

  ngOnDestroy() {
    if (this.connectSubscription) {
      this.connectSubscription.unsubscribe();
    }
    if (this.positionWatch) {
      this.positionWatch.unsubscribe();
    }
    if (this.disconnectSubscription) {
      this.disconnectSubscription.unsubscribe();
    }
  }

  public async getWeatherData(currentLocation) {
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' +
      currentLocation.latitude + '&lon=' + currentLocation.longitude + '&units=metric&appid=517c7bbf790248290ad52d57725c4d5f';
    const loading = await this.loadingController.create({
      message: 'Updating',
    });
    loading.present();
    this.http.get(url).subscribe(async (response) => {
      this.weatherResponse = response;
      loading.dismiss();
    });
  }
}
