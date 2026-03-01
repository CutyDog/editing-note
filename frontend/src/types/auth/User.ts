export interface Profile {
  name: string;
}

export interface User {
  id: number;
  email: string;
  profile?: Profile;
}
