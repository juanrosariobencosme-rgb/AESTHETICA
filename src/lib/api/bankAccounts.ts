import { supabase } from '../supabase';
import { BankAccount } from '../../types';

function fromDbAccount(row: any): BankAccount {
  return {
    id: row.id,
    bankType: row.banktype,
    beneficiary: row.beneficiary,
    accountNumber: row.accountnumber,
    clabe: row.clabe ?? undefined,
    active: row.active ?? undefined
  };
}

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

    return fromDbAccount(data);
  },

  async upsert(account: BankAccount): Promise<BankAccount> {
    const dbAccount = {
      id: 'default',
      banktype: account.bankType,
      beneficiary: account.beneficiary,
      accountnumber: account.accountNumber,
      clabe: account.clabe ?? null,
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

    return fromDbAccount(data);
  }
};
