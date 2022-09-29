import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter
  ) {

  }


  async executeSEED() {

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    //const insertPromises: Promise<CreatePokemonDto>[] = [];
    const pokemonToInsert: CreatePokemonDto[] = [];


    data.results.forEach(({name, url}) => {
      const segment = url.split('/');
      const no: number = +segment[segment.length - 2];

      // insertPromises.push(
      //   this.pokemonModel.create({name, no})
      // )
      pokemonToInsert.push({name, no});

      //this.pokemonService.create({name, no})
    });

    //await Promise.all(insertPromises);
    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed';
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