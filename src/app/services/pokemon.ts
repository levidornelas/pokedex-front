import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaces
export interface Pokemon {
  id: number;
  nome: string;
  imagem_url: string;
  tipos: string[];
  tipo_principal: string;
  hp: number;
  ataque: number;
  defesa: number;
  altura: number;
  peso: number;
  habilidades: string[];
  experiencia_base: number;
  favorito: boolean;
  grupo_batalha: boolean;
}

export interface ListaPokemonsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface GeracaoResponse {
  geracao: number;
  nome: string;
  pokemons: Pokemon[];
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'http://localhost:8000/api/pokeapi';
  private pokemonUrl = 'http://localhost:8000/api/pokemons';

  private usuarioUrl(codigo: number) {
    return `http://localhost:8000/api/pokemons/${codigo}`;
  }

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      return throwError(() => new Error('Erro de conexão'));
    }

    return throwError(() => new Error(error.error?.detail || 'Erro desconhecido'));
  }

  listarPokemons(limit: number = 20, offset: number = 0): Observable<ListaPokemonsResponse> {
    return this.http
      .get<ListaPokemonsResponse>(`${this.baseUrl}/listar/`, {
        headers: this.getHeaders(),
        params: { limit: limit.toString(), offset: offset.toString() },
      })
      .pipe(catchError(this.handleError));
  }

  obterDetalhesPokemon(nomeOuId: string | number): Observable<Pokemon> {
    return this.http
      .get<Pokemon>(`${this.baseUrl}/detalhes/`, {
        headers: this.getHeaders(),
        params: { nome: nomeOuId.toString() },
      })
      .pipe(catchError(this.handleError));
  }

  buscarPorGeracao(geracao: number): Observable<GeracaoResponse> {
    return this.http
      .get<GeracaoResponse>(`${this.baseUrl}/por_geracao/`, {
        headers: this.getHeaders(),
        params: { geracao: geracao.toString() },
      })
      .pipe(catchError(this.handleError));
  }
  buscarPorTipo(tipo: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/por_tipo/`, {
        headers: this.getHeaders(),
        params: { tipo },
      })
      .pipe(catchError(this.handleError));
  }

  buscarFavoritos(): Observable<ListaPokemonsResponse> {
    return this.http
      .get<ListaPokemonsResponse>(`${this.pokemonUrl}/favoritos`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  buscarGrupoBatalha(): Observable<ListaPokemonsResponse> {
    return this.http
      .get<ListaPokemonsResponse>(`${this.pokemonUrl}/grupo_batalha`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  toggleFavorito(codigo: number, favorito: boolean) {
    return this.http.patch(
      `${this.usuarioUrl(codigo)}/toggle_favorito/`,
      { favorito },
      { headers: this.getHeaders() }
    );
  }

  toggleGrupoBatalha(codigo: number, grupo: boolean) {
    return this.http.patch(
      `${this.usuarioUrl(codigo)}/toggle_grupo_batalha/`,
      { grupo_batalha: grupo },
      { headers: this.getHeaders() }
    );
  }
}
