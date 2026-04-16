export interface Example {
  id: string;
  source_text: string;
  created_at: string;
  updated_at: string;
  author: {
    display_name: string | null;
    photo_url: string | null;
  };
  translations: {
    id: string;
    translated_text: string;
    created_at: string;
    author: {
      display_name: string | null;
      photo_url: string | null;
    };
  }[];
  jargons: {
    id: string;
    name: string;
    slug: string;
  }[];
}
