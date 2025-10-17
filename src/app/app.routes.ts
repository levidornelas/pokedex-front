import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Cadastro } from './components/cadastro/cadastro';
import { Pokedex } from './components/pokedex/pokedex';
import { PokemonFavoritos } from './components/favoritos/favoritos';
import { GrupoBatalha } from './components/grupo-batalha/grupo-batalha';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'pokedex', component: Pokedex },
  { path: 'favoritos', component: PokemonFavoritos },
  { path: 'grupo-batalha', component: GrupoBatalha },
];
