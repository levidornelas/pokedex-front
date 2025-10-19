import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Cadastro } from './components/cadastro/cadastro';
import { Pokedex } from './components/pokedex/pokedex';
import { PokemonFavoritos } from './components/favoritos/favoritos';
import { GrupoBatalha } from './components/grupo-batalha/grupo-batalha';
import { AdminComponent } from './components/admin/admin';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Login }, // Livre
  { path: 'cadastro', component: Cadastro }, // Livre
  { path: 'pokedex', component: Pokedex, canActivate: [authGuard] },
  { path: 'favoritos', component: PokemonFavoritos, canActivate: [authGuard] },
  { path: 'grupo-batalha', component: GrupoBatalha, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
];
