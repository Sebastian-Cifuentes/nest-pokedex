import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  async executeSEED() {
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=1');

    data.results.forEach(({name, url}) => {
      const segment = url.split('/');
      const no: number = +segment[segment.length - 2];

      console.log({name, no})
    });

    return data.results;
  }

}

// import { Injectable } from '@nestjs/common';
// import axios, { AxiosInstance } from 'axios';
// import {HttpService} from "@nestjs/axios";
// import {map, Observable, tap} from "rxjs";
// import {AxiosResponse} from "axios";

// @Injectable()
// export class SeedService {

//   constructor(private http: HttpService) {
//   }

//   async executeSEED() {
//     return this.http.get('https://pokeapi.co/api/v2/pokemon?limit=650')
//           .pipe(
//               map((axiosResponse: AxiosResponse) => axiosResponse.data));
//   }

// }