export type ExternalPoiMedia = {
  images: string[];
  youtubeEmbedUrl: string;
};

export const COMMONS_QUARTIERI_IMAGES = [
  "https://commons.wikimedia.org/wiki/Special:FilePath/(Explored)%20Laundry%20day%20in%20Naples%20(6018066134).jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Murales%20Napoli.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quartieri%20Spagnoli%2C%20Naples%2020230622%2001.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quartieri%20Spagnoli%2C%20Naples%2020230622%2002.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quartieri%20Spagnoli%2C%20Naples%2020230622%2003.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quartieri%20Spagnoli%2C%20Naples%2020230622%2004.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quartieri%20Spagnoli%2C%20Naples%2020230622%2005.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quartieri%20Spagnoli%2C%20Naples%2020230622%2006.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quartieri%20Spagnoli%2C%20Naples%2020230622%2007.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quartieri%20Spagnoli%2C%20Naples%2020230622%2008.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quartieri%20Spagnoli%2C%20Naples%2020230622%2009.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quartieri%20Spagnoli%2C%20Naples%2020230622%2010.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quartieri%20spagnoli.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quartieri%20Spagnoli.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/QuartieriSpagnoliNaples.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Spanish%20Quarter%2C%20Napoli.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Vico%20Noce%2C%20Quartieri%20Spagnoli.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Crocifisso%20popolare-Napoli.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/I%20RICORDI.jpg?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Spanish%20Quarter%20traffic.JPG?width=1600",
] as const;

export const YOUTUBE_EMBEDS = {
  quartieriWalk: "https://www.youtube.com/embed/Y1-K1_jw6pw",
  maradona: "https://www.youtube.com/embed/RrdhzFrdX08",
  maradonaAlt: "https://www.youtube.com/embed/tv94wY8vXZ4",
  viaToledo: "https://www.youtube.com/embed/NHzoOqhXNQE",
  viaToledoAlt: "https://www.youtube.com/embed/6TiIbwp-jkY",
  galleria: "https://www.youtube.com/embed/XN_95pWOWhI",
  toledoGalleria: "https://www.youtube.com/embed/Zae3iJXKNRw",
} as const;

export const POI_EXTERNAL_MEDIA: Record<string, ExternalPoiMedia> = {
  poi_qs_toledo: {
    images: [
      COMMONS_QUARTIERI_IMAGES[10],
      COMMONS_QUARTIERI_IMAGES[11],
      COMMONS_QUARTIERI_IMAGES[15],
    ],
    youtubeEmbedUrl: YOUTUBE_EMBEDS.viaToledo,
  },
  poi_qs_santa_maria_francesca: {
    images: [
      COMMONS_QUARTIERI_IMAGES[17],
      COMMONS_QUARTIERI_IMAGES[18],
      COMMONS_QUARTIERI_IMAGES[6],
    ],
    youtubeEmbedUrl: YOUTUBE_EMBEDS.quartieriWalk,
  },
  poi_qs_galleria_umberto_i: {
    images: [
      COMMONS_QUARTIERI_IMAGES[15],
      COMMONS_QUARTIERI_IMAGES[10],
      COMMONS_QUARTIERI_IMAGES[11],
    ],
    youtubeEmbedUrl: YOUTUBE_EMBEDS.galleria,
  },
  poi_qs_maradona: {
    images: [
      COMMONS_QUARTIERI_IMAGES[1],
      COMMONS_QUARTIERI_IMAGES[2],
      COMMONS_QUARTIERI_IMAGES[3],
    ],
    youtubeEmbedUrl: YOUTUBE_EMBEDS.maradona,
  },
  poi_qs_montecalvario_001: {
    images: [
      COMMONS_QUARTIERI_IMAGES[6],
      COMMONS_QUARTIERI_IMAGES[7],
      COMMONS_QUARTIERI_IMAGES[16],
    ],
    youtubeEmbedUrl: YOUTUBE_EMBEDS.quartieriWalk,
  },
  poi_qs_montecalvario_002: {
    images: [
      COMMONS_QUARTIERI_IMAGES[7],
      COMMONS_QUARTIERI_IMAGES[8],
      COMMONS_QUARTIERI_IMAGES[16],
    ],
    youtubeEmbedUrl: YOUTUBE_EMBEDS.quartieriWalk,
  },
  poi_qs_teatro_augusteo: {
    images: [
      COMMONS_QUARTIERI_IMAGES[10],
      COMMONS_QUARTIERI_IMAGES[11],
      COMMONS_QUARTIERI_IMAGES[15],
    ],
    youtubeEmbedUrl: YOUTUBE_EMBEDS.toledoGalleria,
  },
};

export function getExternalMediaForPoi(poiId: string): ExternalPoiMedia | null {
  return POI_EXTERNAL_MEDIA[poiId] ?? null;
}
