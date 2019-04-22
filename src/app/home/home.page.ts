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
    private network: Network
  ) {
    this.isOnline = true;
  }
  ngOnInit() {
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.isOnline = false;
    });
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        this.isOnline = true;
        if (this.currentLocation)
          this.getWeatherData(this.currentLocation);
      }, 1000);
    });

    this.positionWatch = this.geoLocation.watchPosition().subscribe((data) => {
      this.currentLocation = data.coords;
      this.getWeatherData(this.currentLocation);
    });

    this.pollingData = interval(60000).subscribe(() => {
      if (this.currentLocation) {
        this.getWeatherData(this.currentLocation);
      }
    });
    /* setInterval(() => {
      if (this.currentLocation) {
        this.getWeatherData(this.currentLocation);
      }
    }, 60000);*/
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
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + currentLocation.latitude + '&lon=' + currentLocation.longitude + '&units=metric&appid=517c7bbf790248290ad52d57725c4d5f';
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
