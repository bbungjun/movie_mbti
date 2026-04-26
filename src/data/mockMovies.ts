import { Movie } from '@/types';

const MOVIES: Movie[] = [
  {
    id: 155,
    title: '다크 나이트',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: null,
    overview: '질서와 혼돈이 충돌하는 슈퍼히어로 범죄극.',
    release_date: '2008-07-18',
    vote_average: 8.5,
    vote_count: 30000,
    genre_ids: [28, 80, 18],
  },
  {
    id: 27205,
    title: '인셉션',
    poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop_path: null,
    overview: '꿈속의 꿈으로 들어가는 하이콘셉트 SF 스릴러.',
    release_date: '2010-07-15',
    vote_average: 8.4,
    vote_count: 32000,
    genre_ids: [28, 878, 9648],
  },
  {
    id: 157336,
    title: '인터스텔라',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: null,
    overview: '인류의 미래를 찾아 우주로 떠나는 SF 드라마.',
    release_date: '2014-11-05',
    vote_average: 8.6,
    vote_count: 33000,
    genre_ids: [12, 18, 878],
  },
  {
    id: 508442,
    title: '기생충',
    poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop_path: null,
    overview: '두 가족의 만남으로 계급의 균열이 드러나는 블랙 코미디.',
    release_date: '2019-05-30',
    vote_average: 8.5,
    vote_count: 17000,
    genre_ids: [35, 18, 53],
  },
  {
    id: 597,
    title: '타이타닉',
    poster_path: '/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
    backdrop_path: null,
    overview: '거대한 비극 속에서 피어나는 사랑 이야기.',
    release_date: '1997-12-19',
    vote_average: 7.9,
    vote_count: 24000,
    genre_ids: [18, 10749],
  },
  {
    id: 807,
    title: '세븐',
    poster_path: '/6yoghtyTpznpBik8EngEmJskVUO.jpg',
    backdrop_path: null,
    overview: '일곱 가지 죄악을 따라가는 어두운 범죄 스릴러.',
    release_date: '1995-09-22',
    vote_average: 8.4,
    vote_count: 21000,
    genre_ids: [80, 9648, 53],
  },
  {
    id: 694,
    title: '샤이닝',
    poster_path: '/nRj5511mZdTl4saWEPoj9QroTIu.jpg',
    backdrop_path: null,
    overview: '고립된 호텔에서 벌어지는 심리 공포.',
    release_date: '1980-05-23',
    vote_average: 8.2,
    vote_count: 16000,
    genre_ids: [27, 53],
  },
  {
    id: 862,
    title: '토이 스토리',
    poster_path: '/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg',
    backdrop_path: null,
    overview: '장난감들의 우정과 모험을 그린 애니메이션.',
    release_date: '1995-11-22',
    vote_average: 8.0,
    vote_count: 18000,
    genre_ids: [16, 35, 10751],
  },
];

export const MOCK_MOVIES: Record<string, Movie[]> = {
  action: MOVIES,
  romance: MOVIES,
  thriller: MOVIES,
  horror: MOVIES,
  scifi: MOVIES,
  comedy: MOVIES,
};

export function getMockMoviesByGenre(genreId: string, limit: number = 8): Movie[] {
  return (MOCK_MOVIES[genreId] || MOVIES).slice(0, limit);
}

export function getRandomMockMovies(excludeId: number, limit: number = 3): Movie[] {
  return MOVIES.filter((movie) => movie.id !== excludeId).slice(0, limit);
}
