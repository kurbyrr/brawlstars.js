enum Mode {
  GemGrab = "gemGrab",
  SoloShowdown = "soloShowdown",
  DuoShowdown = "duoShowdown",
  Bounty = "bounty",
  Heist = "heist",
  BrawlBall = "brawlBall",
  Siege = "siege",
  HotZone = "hotZone",
  BigGame = "bigGame",
  Knockout = "knockout",
  VolleyBrawl = "volleyBrawl",
}
export interface Slot {
  startTime: string;
  endTime: string;
  event: Event;
}

export interface Event {
  id: number;
  mode: Mode;
  map: string;
  modifiers?: string[];
}
