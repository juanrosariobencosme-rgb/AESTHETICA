import { supabase } from '../supabase';
import { Order } from '../../types';

export const ordersApi = {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Transform columnas DB (minúsculas) -> camelCase (app)
    return (data || []).map(order => ({
      id: order.id,
      customerName: order.customername,
      customerEmail: order.customeremail,
      paymentMethod: order.paymentmethod,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      shippingZone: order.shippingzone ?? undefined,
      voucherFileName: order.voucherfilename ?? undefined,
      date: order.date,
      status: order.status,
      notes: order.notes
    })) as Order[];
  },

  async getById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Transform columnas DB (minúsculas) -> camelCase (app)
    return {
      id: data.id,
      customerName: data.customername,
      customerEmail: data.customeremail,
      paymentMethod: data.paymentmethod,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      shipping: data.shipping,
      total: data.total,
      shippingZone: data.shippingzone ?? undefined,
      voucherFileName: data.voucherfilename ?? undefined,
      date: data.date,
      status: data.status,
      notes: data.notes
    } as Order;
  },

  async create(order: Order): Promise<Order> {
    // Transform camelCase (app) -> columnas DB (minúsculas)
    const dbOrder = {
      id: order.id,
      customername: order.customerName,
      customeremail: order.customerEmail,
      paymentmethod: order.paymentMethod,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      shippingzone: order.shippingZone ?? null,
      voucherfilename: order.voucherFileName ?? null,
      date: order.date,
      status: order.status,
      notes: order.notes ?? null
    };
    
    const { data, error } = await supabase
      .from('orders')
      .insert(dbOrder)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform columnas DB (minúsculas) -> camelCase (app)
    return {
      id: data.id,
      customerName: data.customername,
      customerEmail: data.customeremail,
      paymentMethod: data.paymentmethod,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      shipping: data.shipping,
      total: data.total,
      shippingZone: data.shippingzone ?? undefined,
      voucherFileName: data.voucherfilename ?? undefined,
      date: data.date,
      status: data.status,
      notes: data.notes
    } as Order;
  },

  async update(id: string, order: Partial<Order>): Promise<Order> {
    // Transform camelCase (app) -> columnas DB (minúsculas)
    const dbOrder: any = {};
    if (order.customerName !== undefined) dbOrder.customername = order.customerName;
    if (order.customerEmail !== undefined) dbOrder.customeremail = order.customerEmail;
    if (order.paymentMethod !== undefined) dbOrder.paymentmethod = order.paymentMethod;
    if (order.items !== undefined) dbOrder.items = order.items;
    if (order.subtotal !== undefined) dbOrder.subtotal = order.subtotal;
    if (order.tax !== undefined) dbOrder.tax = order.tax;
    if (order.shipping !== undefined) dbOrder.shipping = order.shipping;
    if (order.total !== undefined) dbOrder.total = order.total;
    if (order.shippingZone !== undefined) dbOrder.shippingzone = order.shippingZone;
    if (order.voucherFileName !== undefined) dbOrder.voucherfilename = order.voucherFileName;
    if (order.date !== undefined) dbOrder.date = order.date;
    if (order.status !== undefined) dbOrder.status = order.status;
    if (order.notes !== undefined) dbOrder.notes = order.notes;
    
    const { data, error } = await supabase
      .from('orders')
      .update(dbOrder)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform columnas DB (minúsculas) -> camelCase (app)
    return {
      id: data.id,
      customerName: data.customername,
      customerEmail: data.customeremail,
      paymentMethod: data.paymentmethod,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      shipping: data.shipping,
      total: data.total,
      shippingZone: data.shippingzone ?? undefined,
      voucherFileName: data.voucherfilename ?? undefined,
      date: data.date,
      status: data.status,
      notes: data.notes
    } as Order;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateStatus(id: string, status: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform columnas DB (minúsculas) -> camelCase (app)
    return {
      id: data.id,
      customerName: data.customername,
      customerEmail: data.customeremail,
      paymentMethod: data.paymentmethod,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      shipping: data.shipping,
      total: data.total,
      shippingZone: data.shippingzone ?? undefined,
      voucherFileName: data.voucherfilename ?? undefined,
      date: data.date,
      status: data.status,
      notes: data.notes
    } as Order;
  }
};
