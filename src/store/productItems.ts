import { create } from 'zustand';
import type { IAvaliableProducts } from '../interfaces';

export interface IProductExtended extends IAvaliableProducts {
  quantity?: number;
}

interface ProductsState {
  products: IProductExtended[];
  setProducts: (products: IProductExtended[]) => void;
  addProduct: (product: IProductExtended) => void;
  removeProduct: (productId: number) => void;
  updateProduct: (
    productId: number,
    updatedProduct: Partial<IProductExtended>
  ) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearProducts: () => void;
}

export const useProductsStore = create<ProductsState>()(set => ({
  products: [],
  setProducts: (products: IProductExtended[]) => set({ products }),
  addProduct: (product: IProductExtended) =>
    set(state => {
      const existingProduct = state.products.find(
        p => p.productId === product.productId
      );
      if (existingProduct) {
        return {
          products: state.products.map(p =>
            p.productId === product.productId
              ? { ...p, quantity: (p.quantity ?? 0) + 1 }
              : p
          ),
        };
      }

      return {
        products: [...state.products, { ...product, quantity: 1 }],
      };
    }),
  removeProduct: (productId: number) =>
    set(state => ({
      products: state.products.filter(
        product => product.productId !== productId
      ),
    })),
  updateProduct: (
    productId: number,
    updatedProduct: Partial<IProductExtended>
  ) =>
    set(state => ({
      products: state.products.map(product =>
        product.productId === productId
          ? { ...product, ...updatedProduct }
          : product
      ),
    })),
  // En tu store/productItems.ts
  increaseQuantity: (id: number) =>
    set(state => ({
      products: state.products.map(product =>
        product.productId === id
          ? { ...product, quantity: (product.quantity ?? 1) + 1 }
          : product
      ),
    })),
  decreaseQuantity: (id: number) =>
    set(state => ({
      products: state.products
        .map(product =>
          product.productId === id
            ? { ...product, quantity: (product.quantity ?? 1) - 1 }
            : product
        )
        .filter(product => (product.quantity ?? 1) > 0),
    })),
  clearProducts: () =>
    set(() => ({
      products: [],
    })),
}));
