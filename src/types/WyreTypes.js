// @flow

import { asArray, asEither, asMap, asNone, asNumber, asObject, asOptional, asString } from 'cleaners'

export const asGetTransferHistory = asObject({
  data: asArray(
    asObject({
      status: asString,
      closedAt: asNumber,
      createdAt: asNumber,
      id: asString,
      customId: asEither(asString, asNone),
      source: asString,
      dest: asString,
      sourceCurrency: asString,
      destCurrency: asString,
      sourceAmount: asNumber,
      destAmount: asNumber,
      fees: asOptional(asMap(asNumber)),
      sourceName: asString,
      destName: asString,
      message: asEither(asString, asNone),
      exchangeRate: asEither(asNumber, asNone),
      blockchainTxId: asEither(asString, asNone),
      destNickname: asEither(asString, asNone)
    })
  )
})

export const asAddBlockChainToAccount = asObject({ blockchains: asMap(asString) })
export const asBlockchainMap = asMap(asString)
export const asGetPaymentMethods = asObject({
  data: asArray(
    asObject({
      status: asString,
      waitingPrompts: asArray(
        asObject({
          type: asString
        })
      ),
      owner: asString,
      id: asString,
      createdAt: asNumber,
      name: asString,
      blockchains: asBlockchainMap
    })
  )
})
export const asGetAccount = asObject({ status: asString })

export type BlockchainMap = $Call<typeof asBlockchainMap>
export type GetAccount = $Call<typeof asGetAccount>
export type GetPaymentMethods = $Call<typeof asGetPaymentMethods>
export type AddBlockChainToAccount = $Call<typeof asAddBlockChainToAccount>
export type GetTransferHistory = $Call<typeof asGetTransferHistory>
