"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface ProductType {
  id: number;
  title: string;
  content: string;
  cost: string;
  banner_image?: string | null;
}

export default function HomePage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error("Error fetching all products:", error.message);
    } else {
      setProducts(data as ProductType[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">All Products</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-md" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {product.banner_image && (
                  <Image
                    src={product.banner_image}
                    alt={product.title}
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full h-48"
                  />
                )}
                <p>
                  <span className="font-semibold text-muted-foreground">
                    Cost:
                  </span>{" "}
                  ${product.cost}
                </p>
                <p>
                  <span className="font-semibold text-muted-foreground line-clamp-2">
                    Details:
                  </span>{" "}
                  {product.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No products found.</p>
      )}
    </div>
  );
}
