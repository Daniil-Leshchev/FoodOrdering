import { supabase } from "@/src/lib/supabase";
import { InsertTables, UpdateTables } from "@/src/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useProductList = () => {
  return useQuery({
    queryKey: ['products'], //used for caching
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}

export const useInsertProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data: InsertTables<'products'>) {
      const { data: newProduct, error } = await supabase
      .from('products')
      .insert({
        name: data.name,
        image: data.image,
        price: data.price
      })
      .single();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {//when successfully executed
      await queryClient.invalidateQueries(['products']);//updating queries with the key products
      //to see changes right away on menu screen when creating new product
      //behind the scenes it fetches the products again, cause we provided the key needed
    }
  });
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data: UpdateTables<'products'>) {
      const { data: updatedProduct, error } = await supabase
      .from('products')
      .update({
        name: data.name,
        image: data.image,
        price: data.price
      })
      .eq('id', data.id)
      .select()
      .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedProduct;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries(['products']);
      await queryClient.invalidateQueries(['products', id]);
    }
  });
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(id: number) {
      const {error} = await supabase.from('products').delete().eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    }, 
    async onSuccess() {
      await queryClient.invalidateQueries(['products']);//updating list of products
    }
  });
}