import { PropsWithChildren, createContext, useContext, useState } from "react";
import { CartItem } from "../types";
import { randomUUID } from 'expo-crypto';//рандомный id для продукта
import { Tables } from "@/src//database.types";

type Product = Tables<'products'>;

type CartType = {
  items: CartItem[],
  addItem: (product: Product, size: CartItem['size']) => void,
  updateQuantity: (itemId: string, amount: -1 | 1) => void;//minu or plus 1,
  total: number
}

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const addItem = (product: Product, size: CartItem['size']) =>
  {
    const existingItem = items.find(
      (item) => item.product === product && item.size === size
    )
      
    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size: size,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
  }

  const updateQuantity = (itemId: string, amount: -1 | 1) =>
  {
    const updatedItems = items.map((item) =>
      item.id !== itemId ? item : { ...item, quantity: item.quantity + amount }
    )
    .filter(item => item.quantity > 0);
    setItems(updatedItems);
  }
    const total = items.reduce((sum, item) => (sum += item.product.price * item.quantity), 0);
    return (
        <CartContext.Provider value={{ items: items, addItem, updateQuantity, total }}>
          {children}
          {/* предоставляем всем элементам доступ к провайдеру */}
        </CartContext.Provider>
    )
};

export default CartProvider;
export const useCart = () => useContext(CartContext);