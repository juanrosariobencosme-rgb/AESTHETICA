import { supabase } from '../supabase';
import { BankAccount } from '../../types';

export const bankAccountsApi = {
  async get(): Promise<BankAccount | null> {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching bank account config:', error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      bankType: data.bankType,
      beneficiary: data.beneficiary,
      accountNumber: data.accountNumber,
      clabe: data.clabe,
      active: data.active
    } as BankAccount;
  },

  async upsert(account: BankAccount): Promise<BankAccount> {
    const dbAccount = {
      id: 'default',
      bankType: account.bankType,
      beneficiary: account.beneficiary,
      accountNumber: account.accountNumber,
      clabe: account.clabe,
      active: account.active ?? true
    };

    const { data, error } = await supabase
      .from('bank_accounts')
      .upsert(dbAccount, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving bank account config:', error);
      throw error;
    }

    return {
      id: data.id,
      bankType: data.bankType,
      beneficiary: data.beneficiary,
      accountNumber: data.accountNumber,
      clabe: data.clabe,
      active: data.active
    } as BankAccount;
  }
};
