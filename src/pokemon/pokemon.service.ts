import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  private defaultLimit: number

  constructor (
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = configService.getOrThrow<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
   
      return pokemon;
    } catch (err) {
      this.handleException(err);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {

      const {limit = this.defaultLimit, offset = 0} = paginationDto;
      return await this.pokemonModel.find()
              .limit(limit)
              .skip(offset)
              // ordenar la columna 'no' de manera ascendente
              .sort({no: 1})
              .select('-__v');
    } catch (err) {
      throw new Error('This is other error - check logs');
    }
  }

  async findOne(term: string): Promise<Pokemon> {
    let pokemon: Pokemon;

    // find by no
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: term});
    }

    // find by id
    if ( !pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // find by name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()});
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`); 
    
    return pokemon;
  }

 async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne( term );

    if ( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase().trim();

    try {
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (err) {
      this.handleException(err);
    }
    
  }

  async remove(id: string) {

    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    //const result = await this.pokemonModel.findByIdAndDelete(id);
    // return {message: 'Pokemon is deleted successfully'};
    
    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id});
    if ( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id "${id}" not found`);

    return {message:'The pokemos was deleted successfully'};
  }

  private handleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemin exist in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error)
    throw new InternalServerErrorException(`Can't update Pokemon - check server logs`);
  }

}
