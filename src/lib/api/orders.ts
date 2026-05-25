import { supabase } from '../supabase';
import { Order } from '../../types';

function fromDbOrder(order: any): Order {
  return {
    id: order.id,
    customerName: order.customer_name ?? order.customername,
    customerEmail: order.customer_email ?? order.customeremail,
    paymentMethod: order.payment_method ?? order.paymentmethod,
    items: order.items,
    subtotal: order.subtotal,
    tax: order.tax,
    shipping: order.shipping,
    total: order.total,
    shippingZone: order.shipping_zone ?? order.shippingzone ?? undefined,
    voucherFileName: order.voucher_file_name ?? order.voucherfilename ?? undefined,
    date: order.date,
    status: order.status,
    notes: order.notes
  } as Order;
}

function shouldRetryWithLegacyColumns(error: any): boolean {
  // Solo reintentar con columnas legacy cuando el error viene
  // específicamente por columnas faltantes del esquema "snake_case".
  const message = String(error?.message || '');
  const lower = message.toLowerCase();
  const isMissingColumn =
    error?.code === 'PGRST204' ||
    error?.code === '42703' ||
    (lower.includes('schema cache') && lower.includes('could not find')) ||
    lower.includes('does not exist');

  if (!isMissingColumn) return false;

  // Si menciona columnas snake_case, hacemos fallback a legacy.
  // Ej: customer_email, payment_method, shipping_zone, voucher_file_name
  return (
    message.includes('customer_email') ||
    message.includes('customer_name') ||
    message.includes('payment_method') ||
    message.includes('shipping_zone') ||
    message.includes('voucher_file_name') ||
    message.includes('created_at') ||
    message.includes('updated_at')
  );
}

function toLegacyDbOrder(order: Order): any {
  return {
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
}

export const ordersApi = {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return (data || []).map(fromDbOrder);
  },

  async getById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return fromDbOrder(data);
  },

  async create(order: Order): Promise<Order> {
    const dbOrder = {
      id: order.id,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      payment_method: order.paymentMethod,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      shipping_zone: order.shippingZone ?? null,
      voucher_file_name: order.voucherFileName ?? null,
      date: order.date,
      status: order.status,
      notes: order.notes ?? null
    };

    let { data, error } = await supabase
      .from('orders')
      .insert(dbOrder)
      .select()
      .single();

    if (error && shouldRetryWithLegacyColumns(error)) {
      const legacyOrder = toLegacyDbOrder(order);
      ({ data, error } = await supabase
        .from('orders')
        .insert(legacyOrder)
        .select()
        .single());
    }

    if (error) throw error;
    return fromDbOrder(data);
  },

  async update(id: string, order: Partial<Order>): Promise<Order> {
    const dbOrder: any = {};
    if (order.customerName !== undefined) dbOrder.customer_name = order.customerName;
    if (order.customerEmail !== undefined) dbOrder.customer_email = order.customerEmail;
    if (order.paymentMethod !== undefined) dbOrder.payment_method = order.paymentMethod;
    if (order.items !== undefined) dbOrder.items = order.items;
    if (order.subtotal !== undefined) dbOrder.subtotal = order.subtotal;
    if (order.tax !== undefined) dbOrder.tax = order.tax;
    if (order.shipping !== undefined) dbOrder.shipping = order.shipping;
    if (order.total !== undefined) dbOrder.total = order.total;
    if (order.shippingZone !== undefined) dbOrder.shipping_zone = order.shippingZone;
    if (order.voucherFileName !== undefined) dbOrder.voucher_file_name = order.voucherFileName;
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
    return fromDbOrder(data);
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
    return fromDbOrder(data);
  }
};
