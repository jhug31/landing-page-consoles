import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  imageUrl?: string;
  fileName?: string;
}

const ProductCard = ({ imageUrl, fileName }: ProductCardProps) => {
  const [productUrl, setProductUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductUrl = async () => {
      if (!fileName) return;

      // Extraire le numéro de fiche du nom de fichier
      const fileNumber = fileName.replace(/^servante_/, '').replace('.png', '');
      
      try {
        const { data, error } = await supabase
          .from('urls_associes')
          .select('url')
          .eq('numero_fiche', fileNumber)
          .maybeSingle();

        if (error) {
          console.error('Erreur lors de la récupération de l\'URL:', error);
          return;
        }

        if (data) {
          setProductUrl(data.url);
        }
      } catch (error) {
        console.error('Erreur lors de la requête Supabase:', error);
      }
    };

    fetchProductUrl();
  }, [fileName]);

  const openUrl = () => {
    if (productUrl) {
      window.open(productUrl, '_blank');
    }
  };

  console.log("ProductCard rendering with imageUrl:", imageUrl);

  return (
    <div className="product-card bg-industrial-700 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
      <div 
        className="w-full aspect-square bg-industrial-600 rounded flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={openUrl}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={fileName || "Produit"} 
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Error loading image:', imageUrl);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-industrial-800 flex items-center justify-center text-gray-400">
            Produit
          </div>
        )}
      </div>
      {productUrl && (
        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-sm text-gray-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
        >
          Voir fiche-produit <ArrowUpRight className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};

export default ProductCard;