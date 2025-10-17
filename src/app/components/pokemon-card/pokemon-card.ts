import { Component, Input } from '@angular/core';
import { Pokemon } from '../../services/pokemon';
import { PokemonService } from '../../services/pokemon';
import { TypeMapperService } from '../../services/type-mapper';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.html',
  styleUrls: ['./pokemon-card.css'],
})
export class PokemonCard {
  @Input() pokemon!: Pokemon;
  @Input() showStats: boolean = false;

  actionMessage: { type: 'success' | 'danger'; message: string } | null = null;

  constructor(private pokemonService: PokemonService, public typeMapper: TypeMapperService) {}

  private showActionMessage(type: 'success' | 'danger', message: string) {
    this.actionMessage = { type, message };
    setTimeout(() => (this.actionMessage = null), 1000);
  }

  toggleFavorito() {
    this.pokemonService.toggleFavorito(this.pokemon.id, !this.pokemon.favorito).subscribe({
      next: (res: any) => {
        this.pokemon.favorito = res.favorito;
        this.showActionMessage('success', `${this.pokemon.nome} foi atualizado nos favoritos.`);
      },
      error: () => this.showActionMessage('danger', 'Erro ao alterar favorito.'),
    });
  }

  toggleGrupo() {
    this.pokemonService.toggleGrupoBatalha(this.pokemon.id, !this.pokemon.grupo_batalha).subscribe({
      next: (res: any) => {
        this.pokemon.grupo_batalha = res.grupo_batalha;
        const acao = res.grupo_batalha ? 'adicionado ao' : 'removido do';
        this.showActionMessage('success', `${this.pokemon.nome} foi ${acao} grupo de batalha.`);
      },
      error: (err) => {
        if (err.status === 400 && err.error && err.error.grupo_batalha) {
          this.showActionMessage('danger', err.error.grupo_batalha[0]);
        } else if (err.status === 400 && err.error && err.error.error) {
          this.showActionMessage('danger', err.error.error);
        } else {
          this.showActionMessage('danger', 'Erro ao alterar grupo de batalha.');
        }
      },
    });
  }

  traduzirTipo(tipoEmIngles: string): string {
    return this.typeMapper.traduzirParaPt(tipoEmIngles);
  }
}
