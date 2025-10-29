// utils/api.ts

/**
 * Fonction utilitaire pour synchroniser un utilisateur Clerk avec le backend
 * Cette fonction est typiquement appelée après une authentification réussie chez Clerk
 * pour créer ou mettre à jour l'utilisateur dans la base de données du backend
 */
export async function syncUserToBackend(clerkId: string, email: string, token?: string) {
  // Appel API vers le backend pour synchroniser l'utilisateur
  const res = await fetch("http://localhost:3000/api/users/sync", {
    method: "POST",  // Méthode POST pour créer/mettre à jour la ressource
    headers: {
      "Content-Type": "application/json",  // Indique que le corps est en JSON
      // Inclusion conditionnelle du token d'autorisation si fourni
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // Envoi des données utilisateur essentielles au backend
    body: JSON.stringify({ 
      clerkId,  // Identifiant unique de l'utilisateur chez Clerk
      email,    // Adresse email de l'utilisateur
    }),
  });
  
  // Retourne la réponse parsée en JSON
  return res.json();
}