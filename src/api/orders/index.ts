import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering']
  return useQuery({
    queryKey: ['orders', archived],
    //если не передавать archived, то в не зависимости от значения все данные будут сохраняться в одном месте, в обоих вкладках будут одинаковые данные
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', statuses);
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
      const { data, error } = await supabase.from('orders').select('*').eq('user_id', id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}