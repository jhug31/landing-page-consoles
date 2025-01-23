import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProductInfo {
  reference: string | null;
  description: string | null;
  url: string | null;
}

export const useProductData = (fileName?: string) => {
  const [ficheProduitUrl, setFicheProduitUrl] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductInfo = async () => {
      if (!fileName) {
        setIsLoading(false);
        return;
      }

      try {
        // Clean the file number by removing .png and spaces
        const numeroFiche = fileName.replace('.png', '').trim();
        console.log('Fetching product info for numero_fiche:', numeroFiche);

        // Fetch from urls_associes
        const { data: productData, error: productError } = await supabase
          .from('urls_associes')
          .select('reference, description, url')
          .eq('numero_fiche', numeroFiche)
          .maybeSingle();

        if (productError) {
          console.error('Error fetching product data:', productError);
          throw productError;
        }

        // Fetch from description table
        const { data: descriptionData, error: descriptionError } = await supabase
          .from('description')
          .select('description')
          .eq('numero_fiche', numeroFiche)
          .maybeSingle();

        if (descriptionError) {
          console.error('Error fetching description:', descriptionError);
          throw descriptionError;
        }

        console.log('Product data received:', productData);
        console.log('Description data received:', descriptionData);

        if (productData) {
          setProductInfo({
            reference: productData.reference,
            description: productData.description,
            url: productData.url
          });
          setFicheProduitUrl(productData.url || null);
        } else {
          console.log('No product data found for numero_fiche:', numeroFiche);
          setProductInfo(null);
          // Try to get URL from storage if no database URL
          const { data: publicUrl } = supabase
            .storage
            .from('fiches produits')
            .getPublicUrl(`${numeroFiche}.png`);
          
          if (publicUrl) {
            setFicheProduitUrl(publicUrl.publicUrl);
          }
        }

        // Set description from the description table if available
        if (descriptionData) {
          setDescription(descriptionData.description);
        }

      } catch (err) {
        console.error('Error in fetchProductInfo:', err);
        setError('Erreur lors du chargement des informations du produit');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductInfo();
  }, [fileName]);

  return { ficheProduitUrl, productInfo, description, isLoading, error };
};