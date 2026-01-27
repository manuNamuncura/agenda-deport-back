export interface PlaceStats {
  placeName: string;
  totalMatches: number;
  wins: number;
  losses: number;
  ties: number;
  goalsFor: number;
  goalsAgainst: number;
  winRate: number;
  goalsDifference: number;
  lastPlayed: Date;
}
