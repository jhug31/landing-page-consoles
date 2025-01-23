import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProductInfo {
  reference: string | null;
  description: string | null;
}

export const useProductData = (fileName?: string) => {
  const [ficheProduitUrl, setFicheProduitUrl] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductInfo = async () => {
      if (!fileName) {
        setIsLoading(false);
        return;
      }

      try {
        const numeroFiche = fileName.replace('.png', '');
        console.log('Fetching product info for numero_fiche:', numeroFiche);

        const { data: productData, error: productError } = await supabase
          .from('urls_associes')
          .select('reference, description')
          .eq('numero_fiche', numeroFiche)
          .maybeSingle();

        if (productError) {
          console.error('Error fetching product data:', productError);
          throw productError;
        }

        console.log('Product data received:', productData);

        if (productData) {
          setProductInfo(productData);
        } else {
          console.log('No product data found for numero_fiche:', numeroFiche);
        }

        const { data: publicUrl } = supabase
          .storage
          .from('fiches produits')
          .getPublicUrl(`${numeroFiche}.png`);

        if (publicUrl) {
          setFicheProduitUrl(publicUrl.publicUrl);
        }
      } catch (err) {
        console.error('Error fetching product info:', err);
        setError('Erreur lors du chargement des informations du produit');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductInfo();
  }, [fileName]);

  return { ficheProduitUrl, productInfo, isLoading, error };
};