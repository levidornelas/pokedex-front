import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TypeMapperService {
  // Mapeamento dos tipos em Inglês (chave da API) para Português (para exibição)
  private tipoNomes: Record<string, string> = {
    grass: 'Grama',
    fire: 'Fogo',
    water: 'Água',
    electric: 'Elétrico',
    rock: 'Pedra',
    flying: 'Voador',
    bug: 'Inseto',
    normal: 'Normal',
    ghost: 'Fantasma',
    steel: 'Aço',
    dark: 'Sombrio',
    poison: 'Venenoso',
    ground: 'Terra',
    fairy: 'Fada',
    psychic: 'Psíquico',
    ice: 'Gelo',
    dragon: 'Dragão',
    fighting: 'Lutador',
  };

  // Mapeamento reverso (Português para Inglês) para requisições de API
  private tipoTraducoes: Record<string, string> = {
    grama: 'grass',
    fogo: 'fire',
    água: 'water',
    elétrico: 'electric',
    pedra: 'rock',
    voador: 'flying',
    inseto: 'bug',
    normal: 'normal',
    fantasma: 'ghost',
    aço: 'steel',
    sombrio: 'dark',
    venenoso: 'poison',
    terra: 'ground',
    fada: 'fairy',
    psíquico: 'psychic',
    gelo: 'ice',
    dragão: 'dragon',
    lutador: 'fighting',
  };

  public tipoClasses: Record<string, string> = {
    grama: 'bg-success text-white',
    fogo: 'bg-danger text-white',
    água: 'bg-primary text-white',
    elétrico: 'bg-warning text-dark',
    pedra: 'bg-secondary text-white',
    voador: 'bg-info text-dark',
    inseto: 'bg-success text-white',
    normal: 'bg-secondary text-white', 
    fantasma: 'bg-dark text-white',
    aço: 'bg-secondary text-white',
    sombrio: 'bg-dark text-white',
    venenoso: 'bg-purple text-white', 
    terra: 'bg-brown text-white',
    fada: 'bg-pink text-dark', 
    psíquico: 'bg-pink text-white',
    gelo: 'bg-info text-white',
    dragão: 'bg-primary text-white',
    lutador: 'bg-orange text-white', 
  };

  traduzirParaPt(tipoEmIngles: string): string {
    const tipo = tipoEmIngles.toLowerCase();
    return this.tipoNomes[tipo] || tipoEmIngles;
  }


  traduzirParaEn(tipoEmPortugues: string): string {
    const tipo = tipoEmPortugues.toLowerCase();
    return this.tipoTraducoes[tipo] || tipoEmPortugues;
  }
}