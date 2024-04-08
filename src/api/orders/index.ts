import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import { InsertTables } from "@/src/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering']
  return useQuery({
    queryKey: ['orders', archived],
    //если не передавать archived, то в не зависимости от значения все данные будут сохраняться в одном месте, в обоих вкладках будут одинаковые данные
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', statuses)
        .order('created_at', {ascending: false});
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}

export const useMyOrderList = () => {
  const { session } = useAuth();
  const id = session?.user.id;
  return useQuery({
    queryKey: ['orders', { userId: id}],
    queryFn: async () => {
      if (!id) {
        return null;
      }
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', id)
        .order('created_at', {ascending: false});
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        //честно, эт какая-то магия. мы еще получаем доступ к products, которые есть у нашего order_item
        //так можно получить доступ к полям, которых нет изначально у объекта и не нужно создавать какие-то доп relation'ы
        .eq('id', id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;
  return useMutation({
    async mutationFn(data: InsertTables<'orders'>) {
      const { data: newOrder, error } = await supabase
      .from('orders')
      .insert({ ...data, user_id: userId })
      .select()
      .single();

      if (error) {
        throw new Error(error.message);
      }
      return newOrder;
    },
    async onSuccess() {
      await queryClient.invalidateQueries(['orders']);
    }
  });
}