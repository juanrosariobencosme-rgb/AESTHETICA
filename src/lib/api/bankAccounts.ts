import { supabase } from '../supabase';
import { BankAccount } from '../../types';

function fromDbAccount(row: any): BankAccount {
  return {
    id: row.id,
    bankType: row.bank_type,
    beneficiary: row.beneficiary,
    accountNumber: row.account_number ?? row.accountnumber,
    clabe: row.clabe ?? undefined,
    active: row.active ?? undefined
  };
}

function shouldRetryWithLegacyColumns(error: any): boolean {
  const message = String(error?.message || '').toLowerCase();
  return (
    error?.code === 'PGRST204' ||
    error?.code === '42703' ||
    error?.code === '406' ||
    message.includes('schema cache') ||
    message.includes('could not find') ||
    message.includes('does not exist') ||
    message.includes('not acceptable')
  );
}

function toLegacyDbAccount(account: BankAccount): any {
  return {
    id: 'default',
    bank_type: account.bankType || 'Banco Premium',
    banktype: account.bankType || 'Banco Premium',
    beneficiary: account.beneficiary,
    accountnumber: account.accountNumber,
    account_number: account.accountNumber,
    clabe: account.clabe ?? null,
    active: account.active ?? true
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
      bank_type: account.bankType || 'Banco Premium',
      beneficiary: account.beneficiary,
      account_number: account.accountNumber,
      clabe: account.clabe ?? null,
      active: account.active ?? true
    };

    let { data, error } = await supabase
      .from('bank_accounts')
      .upsert(dbAccount, { onConflict: 'id' })
      .select()
      .single();

    if (error && shouldRetryWithLegacyColumns(error) && String(error.message || '').match(/account_number|accountnumber|bank_type|banktype/)) {
      const legacyDbAccount = toLegacyDbAccount(account);
      ({ data, error } = await supabase
        .from('bank_accounts')
        .upsert(legacyDbAccount, { onConflict: 'id' })
        .select()
        .single());
    }

    if (error) {
      console.error('Error saving bank account config:', error);
      throw error;
    }

    return fromDbAccount(data);
  }
};
