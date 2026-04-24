import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../services/firebaseService';

export const SHOP_NAV_THRESHOLD = 3;

export function useShopGate() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['shop-gate'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  const realPublishedCount = products.length;

  return {
    isLoading,
    realPublishedCount,
    isShopDiscoverable: realPublishedCount >= SHOP_NAV_THRESHOLD,
  };
}
