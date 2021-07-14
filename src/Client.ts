import Cache, { Options } from "node-cache";
import fetch from "node-fetch";
import { stringify } from "querystring";
import { Brawler } from "./Brawler";
import { Club, ClubMember, RankingsClub } from "./Club";
import { Slot } from "./Events";
import { Player, PlayerBattlelog, RankingsPlayer } from "./Player";
import { cleanTag } from "./utils";

export interface ClientOptions {
  cache: boolean;
  cacheOptions?: Options;
  baseURL?: string;
}

export class APIError extends Error {
  public status: number;

  public constructor(text: string, status: number) {
    super(text);
    this.status = status;
  }
}

export class Client {
  public token: string;
  public cache?: Cache;
  public baseURL: string;

  public constructor(token: string, options: ClientOptions = { cache: true }) {
    this.token = token;
    this.cache = options.cache ? new Cache(options.cacheOptions) : undefined;
    this.baseURL = options.baseURL ?? "https://api.brawlstars.com/v1";
  }

  /**
   * Returns the bearer value for authorization header.
   * @returns {String}
   */
  public get authorization(): string {
    return `Bearer ${this.token}`;
  }

  private async _fetch<T>(path: string, query?: any): Promise<T> {
    const url = this.baseURL + path + (query ? "?" + stringify(query) : "");
    const exists = this.cache?.get<T>(url);
    if (exists) return exists;

    const response = await fetch(url, {
      headers: {
        Authorization: this.authorization,
        "User-Agent": "BrawlStars.js https://github.com/pollen5/brawlstars.js",
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new APIError(response.statusText, response.status);

    const data = await response.json();
    const cache = response.headers.get("cache-control");
    const ttl =
      cache && cache.startsWith("max-age=") ? parseInt(cache.slice(8)) : 0;

    if (ttl) this.cache?.set(url, data, ttl);

    return data;
  }

  /**
   * Fetch data about a player
   * @param tag Player in-game tag
   * @returns Object with player data
   */
  public async getPlayer(tag: string): Promise<Player> {
    const res = await this._fetch<Player>(`/players/%23${cleanTag(tag)}`);
    // Thanks a lot supercell.
    res.x3vs3Victories = (res as any)["3vs3Victories"];
    return res;
  }

  /**
   *
   * @param tag Player in-game tag
   * @returns Array of the player latest games
   */
  public async getPlayerBattlelog(tag: string): Promise<PlayerBattlelog[]> {
    return this._fetch<PlayerBattlelog[]>(
      `/players/%23${cleanTag(tag)}/battlelog`
    );
  }

  /**
   *
   * @param tag Club's tag
   * @returns Object with club data
   */
  public async getClub(tag: string): Promise<Club> {
    return this._fetch<Club>(`/clubs/%23${cleanTag(tag)}`);
  }

  /**
   *
   * @param country Country's ID
   * @param queryParams More info about these on https://developer.brawlstars.com
   * @returns
   */
  public async getPlayerRankings(
    country: string,
    {
      before,
      after,
      limit,
    }: { before?: string; after?: string; limit?: number } = {}
  ): Promise<RankingsPlayer[]> {
    const query: any = {};
    if (before) query.before = before;
    if (after) query.after = after;
    if (limit) query.limit = limit;

    return this._fetch<RankingsPlayer[]>(`/rankings/${country}/players`, query);
  }

  /**
   *
   * @param country Country's ID
   * @param queryParams More info about these on https://developer.brawlstars.com
   * @returns
   */
  public async getClubRankings(
    country: string,
    {
      before,
      after,
      limit,
    }: { before?: string; after?: string; limit?: number } = {}
  ): Promise<RankingsClub[]> {
    const query: any = {};
    if (before) query.before = before;
    if (after) query.after = after;
    if (limit) query.limit = limit;

    return this._fetch<RankingsClub[]>(`/rankings/${country}/clubs`, query);
  }

  /**
   *
   * @param country Country's ID
   * @param brawler Brawler's ID
   * @param queryParams More info about these on https://developer.brawlstars.com
   * @returns
   */
  public async getBrawlerRankings(
    country: string,
    brawler: string,
    {
      before,
      after,
      limit,
    }: { before?: string; after?: string; limit?: number } = {}
  ): Promise<RankingsPlayer[]> {
    const query: any = {};
    if (before) query.before = before;
    if (after) query.after = after;
    if (limit) query.limit = limit;

    return this._fetch<RankingsPlayer[]>(
      `/rankings/${country}/brawlers/${brawler}`,
      query
    );
  }

  /**
   *
   * @param tag The club's tag
   * @param queryParams More info about these on https://developer.brawlstars.com
   * @returns Array of members
   */
  public async getClubMembers(
    tag: string,
    {
      before,
      after,
      limit,
    }: { before?: string; after?: string; limit?: number } = {}
  ): Promise<ClubMember[]> {
    const query: any = {};
    if (before) query.before = before;
    if (after) query.after = after;
    if (limit) query.limit = limit;

    return this._fetch<ClubMember[]>(
      `/clubs/%23${cleanTag(tag)}/members`,
      query
    );
  }

  /**
   *
   * @param queryParams More info about these on https://developer.brawlstars.com
   * @returns An array of all the brawlers
   */
  public async getBrawlers({
    before,
    after,
    limit,
  }: { before?: string; after?: string; limit?: number } = {}): Promise<
    Brawler[]
  > {
    const query: any = {};
    if (before) query.before = before;
    if (after) query.after = after;
    if (limit) query.limit = limit;

    return this._fetch<Brawler[]>(`/brawlers`, query);
  }

  /**
   *
   * @param id Brawler ID
   * @returns An object containing data about a brawler
   */
  public async getBrawler(id: string) {
    return this._fetch<Brawler>(`/brawlers/${id}`);
  }

  /**
   *
   * @returns An array containing data about each map slot
   */
  public async getMapRotation() {
    return this._fetch<Slot[]>("/events/rotation");
  }
}
