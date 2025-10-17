import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService, Pokemon } from '../../services/pokemon';
import { TypeMapperService } from '../../services/type-mapper';
import { PokemonCard } from '../pokemon-card/pokemon-card';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Sparkles, Swords } from 'lucide-angular';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, FormsModule, PokemonCard, RouterModule, LucideAngularModule],
  templateUrl: './pokedex.html',
  styleUrls: ['./pokedex.css'],
})
export class Pokedex implements OnInit {
  pokemons: Pokemon[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  selectedGen: string = '';
  currentPage = 1;
  limit = 20;
  totalCount = 0;
  currentTypeFilter: string | null = null;

  readonly Sparkles = Sparkles;
  readonly Swords = Swords;

  constructor(
    private pokemonService: PokemonService,
    public typeMapper: TypeMapperService,
    private router: Router
  ) {}

  irParaFavoritos() {
    this.router.navigate(['/favoritos']);
  }

  irParaGrupo() {
    this.router.navigate(['/grupo-batalha']);
  }

  ngOnInit(): void {
    this.carregarPokemons();
  }

  carregarPokemons(): void {
    this.loading = true;
    this.error = null;

    if (this.currentTypeFilter) {
      this.pokemonService.buscarPorTipo(this.currentTypeFilter).subscribe({
        next: (res) => {
          this.pokemons = res.results || res.pokemons;
          this.totalCount = this.pokemons.length;
          this.loading = false;
        },
        error: (err) => {
          this.error =
            err.message || `Erro ao carregar pokémons do tipo ${this.currentTypeFilter}.`;
          this.loading = false;
        },
      });
      return;
    }

    this.pokemonService.listarPokemons(this.limit, (this.currentPage - 1) * this.limit).subscribe({
      next: (response) => {
        this.pokemons = response.results;
        this.totalCount = response.count;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Erro ao carregar pokémons.';
        this.loading = false;
      },
    });
  }

  filtrarPorGeracao(): void {
    if (!this.selectedGen) {
      this.carregarPokemons();
      return;
    }

    this.currentTypeFilter = null;
    this.searchTerm = '';
    this.loading = true;

    this.pokemonService.buscarPorGeracao(parseInt(this.selectedGen)).subscribe({
      next: (res) => {
        this.pokemons = res.pokemons;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  buscarPorNome(): void {
    if (!this.searchTerm.trim()) {
      this.carregarPokemons();
      return;
    }

    this.currentTypeFilter = null;
    this.selectedGen = '';
    this.loading = true;

    this.pokemonService.obterDetalhesPokemon(this.searchTerm).subscribe({
      next: (res) => {
        this.pokemons = [res];
        this.loading = false;
      },
      error: () => {
        this.error = 'Pokémon não encontrado.';
        this.loading = false;
      },
    });
  }

  mudarPagina(delta: number): void {
    if (this.currentTypeFilter || this.searchTerm) return;

    const novaPagina = this.currentPage + delta;
    if (novaPagina < 1) return;
    if (novaPagina > Math.ceil(this.totalCount / this.limit)) return;

    this.currentPage = novaPagina;
    this.carregarPokemons();
  }

  buscarPorTipo(tipo: string): void {
    this.searchTerm = '';
    this.selectedGen = '';
    this.currentPage = 1;
    const tipoEmIngles = this.typeMapper.traduzirParaEn(tipo);
    this.currentTypeFilter = tipoEmIngles === 'todos' || !tipo ? null : tipoEmIngles;
    this.carregarPokemons();
  }
}
