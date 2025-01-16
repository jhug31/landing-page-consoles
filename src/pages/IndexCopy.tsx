import { useState } from "react";
import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const IndexCopy = () => {
  const [loading, setLoading] = useState(true);

  // Simuler un court chargement pour la transition
  setTimeout(() => {
    setLoading(false);
  }, 500);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-32 flex flex-col">
        <div className="text-left mb-32 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">
            Servantes d'atelier
          </h1>
          <Separator className="my-4 w-16 bg-gray-600" />
          <p className="text-gray-400 text-base tracking-widest">
            INDUSTRIAL PRODUCTS
          </p>
        </div>

        <div 
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-fadeIn" 
          style={{ animationDelay: "0.2s" }}
        >
          {loading ? (
            Array(5).fill(null).map((_, index) => (
              <div key={index} className="bg-industrial-700 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
                <div className="w-full aspect-square bg-industrial-600 rounded animate-pulse" />
                <div className="w-full h-10 bg-industrial-600 rounded animate-pulse" />
              </div>
            ))
          ) : (
            Array(5).fill(null).map((_, index) => (
              <ProductCard key={index} />
            ))
          )}
        </div>
      </main>

      <footer className="mt-16 border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex md:justify-center items-center">
            <div className="rounded-full bg-industrial-700 p-3 inline-flex items-center justify-center">
              <Mail className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexCopy;