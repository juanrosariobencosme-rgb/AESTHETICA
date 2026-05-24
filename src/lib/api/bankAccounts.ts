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
      bankType: data.bank_type,
      beneficiary: data.beneficiary,
      accountNumber: data.account_number,
      clabe: data.clabe,
      active: data.active
    } as BankAccount;
  },

  async upsert(account: BankAccount): Promise<BankAccount> {
    const dbAccount = {
      id: 'default',
      bank_type: account.bankType,
      beneficiary: account.beneficiary,
      account_number: account.accountNumber,
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
      bankType: data.bank_type,
      beneficiary: data.beneficiary,
      accountNumber: data.account_number,
      clabe: data.clabe,
      active: data.active
    } as BankAccount;
  }
};
