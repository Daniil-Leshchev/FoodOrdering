import { supabase } from "@/src/lib/supabase";
import { InsertTables } from "@/src/types";
import { useMutation } from "@tanstack/react-query";

export const useInsertOrderItems = () => {
    return useMutation({
      async mutationFn(items: InsertTables<'order_items'>[]) {
        const { data: orderItem, error } = await supabase
        .from('order_items')
        .insert(items)
        .select();

        if (error) {
          throw new Error(error.message);
        }
        return orderItem;
      }
    });
  }