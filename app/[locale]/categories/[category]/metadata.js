export async function generateMetadata({ params: { locale, category } }) {
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  return {
    title: `${formattedCategory} | Tijarah.pk`,
    description: `Browse our selection of ${formattedCategory} products at Tijarah.pk`
  };
}
