import { StarPower } from "./Brawler";

export interface PlayerClub {
  name: string;
  tag: string;
}

export interface RankingsPlayerClub {
  name: string;
}

export interface RankingsPlayer {
  club: RankingsPlayerClub;
  tag: string;
  name: string;
  trophies: number;
  rank: number;
  nameColor: string;
}

export interface PlayerBrawler {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
  highestTrophies: number;
  starPowers: StarPower[];
  gadgets: StarPower[];
}

export interface PlayerBattlelog {
  battle: string;
  battleTime: string;
  event: PlayerBattlelogEvent;
}

export interface PlayerBattlelogEvent {
  mode: string;
  id: number;
  map: string;
}

export interface PlayerIcon {
  id: number;
}

export interface Player {
  name: string;
  tag: string;
  icon: PlayerIcon;
  club?: PlayerClub;
  trophies: number;
  highestTrophies: number;
  isQualifiedFromChampionshipChallenge: boolean;
  nameColor: string;
  brawlers: PlayerBrawler[];
  bestRoboRumbleTime: number;
  bestTimeAsBigBrawler: number;
  duoVictories: number;
  soloVictories: number;
  powerPlayPoints?: number;
  expPoints: number;
  expLevel: number;
  x3vs3Victories: number; // Thanks a lot supercell.
}
