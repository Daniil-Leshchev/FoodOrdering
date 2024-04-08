import { PropsWithChildren, createContext, useContext, useState } from "react";
import { CartItem } from "@/src/types";
import { randomUUID } from 'expo-crypto';//рандомный id для продукта
import { Tables } from "@/src/database.types";
import  React from 'react';
import { useInsertOrder } from "@/src/api/orders";
import { router } from "expo-router";
import { useInsertOrderItems } from "@/src/api/order_items";

type Product = Tables<'products'>;

type CartType = {
  items: CartItem[],
  addItem: (product: Product, size: CartItem['size']) => void,
  updateQuantity: (itemId: string, amount: -1 | 1) => void,//minus or plus 1,
  total: number,
  checkout: () => void,
}

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {}
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

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

  const clearCart = () => {
    setItems([]);
  }

  const checkout = () => {
    insertOrder({ total }, { onSuccess: saveOrderItems });
  }

  const saveOrderItems = (order: Tables<'orders'>) => {
    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      size: cartItem.size
    }));
    
    insertOrderItems(orderItems, { 
      onSuccess() {
        clearCart();
        router.push(`/(user)/orders/${order.id}`);
      }
    }
  );
  }

    return (
        <CartContext.Provider value={{ items: items, addItem, updateQuantity, total, checkout }}>
          {children}
          {/* предоставляем всем элементам доступ к провайдеру */}
        </CartContext.Provider>
    )
};

export default CartProvider;
export const useCart = () => useContext(CartContext);