import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService, Pokemon } from '../../services/pokemon';
import { TypeMapperService } from '../../services/type-mapper';
import { PokemonCard } from '../pokemon-card/pokemon-card';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pokemon-favoritos',
  standalone: true,
  imports: [CommonModule, PokemonCard, RouterModule],
  templateUrl: './favoritos.html',
  styleUrls: ['./favoritos.css'],
})
export class PokemonFavoritos implements OnInit {
  favoritos: Pokemon[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private pokemonService: PokemonService,
    public typeMapper: TypeMapperService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarFavoritos();
  }

  voltarParaPokedex() {
    this.router.navigate(['/pokedex']);
  }

  carregarFavoritos(): void {
    this.loading = true;
    this.error = null;

    this.pokemonService.buscarFavoritos().subscribe({
      next: (res: any) => {
        this.favoritos = res.results.map((p: any) => ({
          id: p.codigo,
          nome: p.nome,
          imagem_url: p.imagem_url,
          tipos: [p.tipo_pokemon.descricao],
          favorito: p.favorito,
          grupo_batalha: p.grupo_batalha,
        }));

        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Erro ao carregar pokémons favoritos.';
        this.loading = false;
      },
    });
  }
}
