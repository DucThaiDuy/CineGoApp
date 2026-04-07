export interface Movie {
  id: string;
  title: string;
  genre: string;
  poster: string;
  rating: number;
  reviews: number;
  duration: string;
  description: string;
  banner: string;
  period: "week" | "month" | "all";
  tag?: "HOT" | "NEW" | "TOP";
}

export const MOVIES: Movie[] = [
  {
    id: "10",
    title: "Oppenheimer",
    genre: "Sci-Fi",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    rating: 4.8,
    reviews: 1240,
    duration: "180 phút",
    description: "Câu chuyện về nhà vật lý lý thuyết J. Robert Oppenheimer, người đứng đầu Dự án Manhattan tạo ra bom nguyên tử đầu tiên.",
    banner: "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    period: "week",
    tag: "HOT",
  },
  {
    id: "11",
    title: "Dune: Part Two",
    genre: "Sci-Fi",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    rating: 4.9,
    reviews: 2100,
    duration: "166 phút",
    description: "Paul Atreides hợp lực với Chani và người Fremen để trả thù những kẻ đã tiêu diệt gia đình mình.",
    banner: "https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    period: "week",
    tag: "TOP",
  },
  {
    id: "1",
    title: "Avengers: Endgame",
    genre: "Action",
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    rating: 4.7,
    reviews: 5000,
    duration: "181 phút",
    description: "Sau những sự kiện tàn khốc của Avengers: Infinity War, vũ trụ đang lụi tàn.",
    banner: "https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    period: "month",
  },
  {
    id: "2",
    title: "The Batman",
    genre: "Action",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    rating: 4.6,
    reviews: 1500,
    duration: "176 phút",
    description: "Khi một kẻ giết người nhắm vào giới thượng lưu của Gotham bằng một loạt các âm mưu tàn bạo.",
    banner: "https://image.tmdb.org/t/p/original/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    period: "all",
    tag: "NEW",
  },
];
