import {
  buildMovieCreatePayload,
  buildMovieUpdatePayload,
} from './buildMovieMutationPayload'

describe('buildMovieMutationPayload', () => {
  const values = {
    movieName: '  Arrival  ',
    releaseDate: '2016-11-11',
    worldwideGross: '203388186',
    productionBudget: '47000000',
    domesticGross: '100546139',
    movieLink: ' https://example.com/arrival ',
    genres: ['Sci-Fi', 'Drama'],
  }

  it('builds a full payload for creates and non-GraphQL edits', () => {
    expect(buildMovieCreatePayload(values)).toEqual({
      movieName: 'Arrival',
      releaseDate: '2016-11-11',
      worldwideGross: 203388186,
      productionBudget: 47000000,
      domesticGross: 100546139,
      movieLink: 'https://example.com/arrival',
      genres: ['Sci-Fi', 'Drama'],
    })

    expect(
      buildMovieUpdatePayload({
        values,
        isGraphQlEditMode: false,
        selectedGraphQlFields: ['releaseDate'],
      }),
    ).toEqual({
      movieName: 'Arrival',
      releaseDate: '2016-11-11',
      worldwideGross: 203388186,
      productionBudget: 47000000,
      domesticGross: 100546139,
      movieLink: 'https://example.com/arrival',
      genres: ['Sci-Fi', 'Drama'],
    })
  })

  it('omits hidden GraphQL edit fields from the update payload', () => {
    expect(
      buildMovieUpdatePayload({
        values,
        isGraphQlEditMode: true,
        selectedGraphQlFields: ['releaseDate', 'genres'],
      }),
    ).toEqual({
      movieName: 'Arrival',
      releaseDate: '2016-11-11',
      genres: ['Sci-Fi', 'Drama'],
    })
  })

  it('handles optional form values that are not registered in the dialog', () => {
    expect(
      buildMovieCreatePayload({
        movieName: 'Arrival',
        releaseDate: '2016-11-11',
        worldwideGross: '0',
        productionBudget: '0',
        domesticGross: '0',
        genres: ['Drama'],
      }),
    ).toEqual({
      movieName: 'Arrival',
      releaseDate: '2016-11-11',
      worldwideGross: 0,
      productionBudget: 0,
      domesticGross: 0,
      movieLink: null,
      genres: ['Drama'],
    })
  })
})
