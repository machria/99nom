export async function fetchCardsData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
    return [];
  }
}