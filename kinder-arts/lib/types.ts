export interface KindergartenYear {
  _id: string;
  /** שם השנה */
  title: string;
  /** שם הגן */
  gardenName?: string;
  /** תיאור הגן */
  gardenDescription?: string;
  /** תאריך תחילת שנה */
  yearStart?: string;
  /** תאריך סיום שנה */
  yearEnd?: string;
  /** שם הגננת */
  teacherName?: string;
  /** תמונת הגן */
  gardenImage?: string;
}

export interface BrilliantQuote {
  _id: string;
  title: string;
  quote?: string;
  context?: string;
  illustration?: string;
  date?: string;
}

export interface Artwork {
  _id: string;
  /** Title (Primary) */
  title: string;
  /** Artwork Image */
  artworkImage?: string;
  /** Kindergarten Year - reference ID */
  kindergartenYear?: string;
  /** Creation Date */
  creationDate?: string;
  /** Artist's Comment */
  artistComment?: string;
  /** Medium */
  medium?: string;
  /** תגיות */
  tags?: string[];
}

export interface Song {
  _id: string;
  title: string;
  artist: string;
  type?: string;
  date?: string;
  spotifyUrl?: string;
  ofriNote?: string;
  ofriNickname?: string;
  coverImage?: string;
}
