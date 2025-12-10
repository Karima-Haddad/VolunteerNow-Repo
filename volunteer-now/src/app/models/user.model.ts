export interface UserModel {
  id: string;                // id de l’utilisateur (string)
  name: string;              
  role: 'benevole' | 'organisation' | 'public'  // correspond aux rôles utilisés
  orgId?: string;            // facultatif, id de l’organisation si nécessaire
  email?: string;
  ville?: string;
  phone?: string;
  photo?: string;
  bio?: string;
  categories?: string;
}
