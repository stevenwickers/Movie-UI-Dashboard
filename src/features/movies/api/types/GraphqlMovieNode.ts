export type GraphqlMovieNode = {
  id: string;
  movieName: string;
  releaseDate?: string;
  worldwideGross?: number | null;
  productionBudget?: number | null;
  domesticGross?: number | null;
  movieLink?: string | null;
  genres?: string[];
  createdAt?: string;
  updatedAt?: string;
};
