import { TransactionResponse } from 'fuels';
// should import BN because of this TS error: https://github.com/microsoft/TypeScript/issues/47663
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TransactionResult, TransactionResultReceipt } from 'fuels';

import { type UseNamedQueryParams, useNamedQuery } from '../core';
import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

type UseTransactionReceiptsParams<TTransactionType = void> = {
  /**
   * The transaction ID to fetch the receipts for.
   */
  txId?: string;
  /**
   * Additional query parameters to customize the behavior of `useNamedQuery`.
   */
  /**
   * Additional query parameters to customize the behavior of `useNamedQuery`.
   */
  query?: UseNamedQueryParams<
    'transactionReceipts',
    TransactionResult<TTransactionType>['receipts'] | null,
    Error,
    TransactionResult<TTransactionType>['receipts'] | null
  >;
};

/**
 * @deprecated
 *
 * Use `useTransactionResult` instead with `select` function in the `query` parameter.
 */
export const useTransactionReceipts = <TTransactionType = void>({
  txId,
  query,
}: UseTransactionReceiptsParams<TTransactionType>) => {
  const { fuel } = useFuel();

  return useNamedQuery('transactionReceipts', {
    queryKey: QUERY_KEYS.transactionReceipts(txId),
    queryFn: async () => {
      try {
        const provider = await fuel.getProvider();
        if (!provider) return null;

        const response = new TransactionResponse(txId || '', provider);
        if (!response) return null;

        const { receipts } = await response.waitForResult();
        return receipts || null;
      } catch (_error: unknown) {
        return null;
      }
    },
    initialData: null,
    enabled: !!txId,
    ...query,
  });
};
