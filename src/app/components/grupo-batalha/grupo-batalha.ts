import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PokemonCard } from '../pokemon-card/pokemon-card';
import { PokemonService, Pokemon } from '../../services/pokemon';
import { TypeMapperService } from '../../services/type-mapper';

@Component({
  selector: 'app-grupo-batalha',
  standalone: true,
  imports: [CommonModule, RouterModule, PokemonCard],
  templateUrl: './grupo-batalha.html',
  styleUrl: './grupo-batalha.css',
})
export class GrupoBatalha implements OnInit {
  grupoBatalha: Pokemon[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private pokemonService: PokemonService,
    public typeMapper: TypeMapperService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarGrupoBatalha();
  }

  voltarParaPokedex() {
    this.router.navigate(['/pokedex']);
  }

  carregarGrupoBatalha(): void {
    this.loading = true;
    this.error = null;

    this.pokemonService.buscarGrupoBatalha().subscribe({
      next: (res: any) => {
        this.grupoBatalha = res.results.map((p: any) => ({
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
        this.error = err.message || 'Erro ao carregar pokémons do grupo de batalha.';
        this.loading = false;
      },
    });
  }
}
