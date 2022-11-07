import { Network } from '@xchainjs/xchain-client'
import {
  AssetAVAX,
  AssetBNB,
  AssetBTC,
  AssetETH,
  AssetLTC,
  AssetRuneNative,
  assetAmount,
  assetFromStringEx,
  assetToBase,
} from '@xchainjs/xchain-util'

import { CryptoAmount } from '../src/crypto-amount'
import { ThorchainCache } from '../src/thorchain-cache'
import { ThorchainQuery } from '../src/thorchain-query'
import {
  AddliquidityPosition,
  EstimateAddLP,
  EstimateAddSaver,
  EstimateWithdrawLP,
  EstimateWithdrawSaver,
  LiquidityPosition,
  SaversPosition,
  WithdrawLiquidityPosition,
  getSaver,
} from '../src/types'
import { Midgard } from '../src/utils/midgard'
import { Thornode } from '../src/utils/thornode'

require('dotenv').config()

const thorchainCache = new ThorchainCache(new Midgard(Network.Mainnet), new Thornode(Network.Mainnet))
const thorchainQuery = new ThorchainQuery(thorchainCache)

// mainnet asset
const BUSD = assetFromStringEx('BNB.BUSD-BD1')
const synthBTC = assetFromStringEx('BTC/BTC')
const USDC = assetFromStringEx('ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48')

function printAdd(estimate: EstimateAddLP) {
  const expanded = {
    slip: estimate.slipPercent.toNumber(),
    poolShare: {
      asset: estimate.poolShare.assetShare.formatedAssetString(),
      rune: estimate.poolShare.runeShare.formatedAssetString(),
    },
    lpUnits: estimate.lpUnits.amount().toNumber(),
    runeToAssetRatio: estimate.runeToAssetRatio.toNumber(),
    inbound: {
      fees: {
        rune: estimate.inbound.fees.rune.formatedAssetString(),
        asset: estimate.inbound.fees.asset.formatedAssetString(),
        total: estimate.inbound.fees.total.formatedAssetString(),
      },
    },
    estimatedWait: estimate.estimatedWaitSeconds.toFixed(),
    errors: estimate.errors,
    canAdd: estimate.canAdd,
  }
  console.log(expanded)
}
function printWithdraw(withdraw: EstimateWithdrawLP) {
  const expanded = {
    slip: `${withdraw.slipPercent.toFixed()} %`,
    asset: withdraw.assetAmount.formatedAssetString(),
    rune: withdraw.runeAmount.formatedAssetString(),
    inbound: {
      minToSend: {
        rune: withdraw.inbound.minToSend.rune.formatedAssetString(),
        asset: withdraw.inbound.minToSend.asset.formatedAssetString(),
        total: withdraw.inbound.minToSend.total.formatedAssetString(),
      },
      fees: {
        rune: withdraw.inbound.fees.rune.formatedAssetString(),
        asset: withdraw.inbound.fees.asset.formatedAssetString(),
        total: withdraw.inbound.fees.total.formatedAssetString(),
      },
    },
    outboundFee: {
      rune: withdraw.outboundFee.rune.formatedAssetString(),
      asset: withdraw.outboundFee.asset.formatedAssetString(),
      total: withdraw.outboundFee.total.formatedAssetString(),
    },
    lpGrowth: withdraw.lpGrowth,
    impermanentLossProtection: {
      ILP: withdraw.impermanentLossProtection.ILProtection.formatedAssetString(),
      totalDays: withdraw.impermanentLossProtection.totalDays,
    },
    estimatedWait: withdraw.estimatedWaitSeconds.toFixed(),
  }
  console.log(expanded)
}

function printSaver(saver: EstimateAddSaver) {
  const expanded = {
    assetAmount: saver.assetAmount.formatedAssetString(),
    fee: {
      networkFee: saver.fee.networkFee.formatedAssetString(),
      liquidityFee: saver.fee.liquidityFee.formatedAssetString(),
      totalFees: saver.fee.totalFees.formatedAssetString(),
    },
    expiry: saver.expiry,
    toAddress: saver.toAddress,
    memo: saver.memo,
    estimateWaitTime: saver.estimatedWaitTime,
  }
  console.log(expanded)
}
function printWithdrawSaver(saver: EstimateWithdrawSaver) {
  const expanded = {
    assetAmount: saver.assetAmount.formatedAssetString(),
    fee: {
      networkFee: saver.fee.networkFee.formatedAssetString(),
      liquidityFee: saver.fee.liquidityFee.formatedAssetString(),
      totalFees: saver.fee.totalFees.formatedAssetString(),
    },
    expiry: saver.expiry,
    toAddress: saver.toAddress,
    memo: saver.memo,
    estimateWaitTime: saver.estimatedWaitTime,
  }
  console.log(expanded)
}
function printSaversPosition(saver: SaversPosition) {
  const expanded = {
    depositValue: saver.depositValue.formatedAssetString(),
    redeemableValue: saver.redeemableValue.formatedAssetString(),
    lastAddHeight: saver.lastAddHeight,
    growth: saver.growth,
    age: saver.age,
  }
  console.log(expanded)
}

function printliquidityPosition(liquidityPosition: LiquidityPosition) {
  const expanded = {
    assetAddress: liquidityPosition.position.asset_address,
    runeAddress: liquidityPosition.position.rune_address,
    assetPool: liquidityPosition.position.asset,
    assetAmount: liquidityPosition.position.asset_deposit_value,
    runeAmount: liquidityPosition.position.rune_deposit_value,
    growth: liquidityPosition.lpGrowth,
    impermanentLossProtection: {
      ILProtection: liquidityPosition.impermanentLossProtection.ILProtection.formatedAssetString(),
      totalDays: liquidityPosition.impermanentLossProtection.totalDays,
    },
  }
  console.log(expanded)
}

// Test User Functions - LP positions estimations
describe('Thorchain-amm liquidity action end to end Tests', () => {
  // Estimate Liquidity Positions
  it(`Should estimate ADD BUSD liquidity postion for given amount`, async () => {
    const addlp: AddliquidityPosition = {
      asset: new CryptoAmount(assetToBase(assetAmount(100)), BUSD),
      rune: new CryptoAmount(assetToBase(assetAmount(50)), AssetRuneNative),
    }
    const estimateADDLP = await thorchainQuery.estimateAddLP(addlp)
    printAdd(estimateADDLP)
    expect(estimateADDLP).toBeTruthy()
  })
  it(`Should estimate ADD ETH liquidity postion for given amount`, async () => {
    const addlp: AddliquidityPosition = {
      asset: new CryptoAmount(assetToBase(assetAmount(1, 18)), AssetETH),
      rune: new CryptoAmount(assetToBase(assetAmount(0)), AssetRuneNative),
    }
    const estimateADDLP = await thorchainQuery.estimateAddLP(addlp)
    printAdd(estimateADDLP)
    expect(estimateADDLP).toBeTruthy()
  })
  it(`Should estimate ADD AVAX liquidity postion for given amount`, async () => {
    const addlp: AddliquidityPosition = {
      asset: new CryptoAmount(assetToBase(assetAmount(1, 18)), AssetAVAX),
      rune: new CryptoAmount(assetToBase(assetAmount(0)), AssetRuneNative),
    }
    const estimateADDLP = await thorchainQuery.estimateAddLP(addlp)
    printAdd(estimateADDLP)
    expect(estimateADDLP).toBeTruthy()
  })
  it(`Should estimate ADD USDC liquidity postion for given amount`, async () => {
    const addlp: AddliquidityPosition = {
      asset: new CryptoAmount(assetToBase(assetAmount(10, 6)), USDC),
      rune: new CryptoAmount(assetToBase(assetAmount(0)), AssetRuneNative),
    }
    const estimateADDLP = await thorchainQuery.estimateAddLP(addlp)
    printAdd(estimateADDLP)
    expect(estimateADDLP).toBeTruthy()
  })
  it(`Should estimate ADD BTC liquidity postion for given amount`, async () => {
    const addlp: AddliquidityPosition = {
      asset: new CryptoAmount(assetToBase(assetAmount(0.001)), AssetBTC),
      rune: new CryptoAmount(assetToBase(assetAmount(0)), AssetRuneNative),
    }
    const estimateADDLP = await thorchainQuery.estimateAddLP(addlp)
    printAdd(estimateADDLP)
    expect(estimateADDLP).toBeTruthy()
  })
  it(`Should estimate ADD BTC liquidity postion for given amount asymmetrical`, async () => {
    const addlp: AddliquidityPosition = {
      asset: new CryptoAmount(assetToBase(assetAmount(1)), AssetBTC),
      rune: new CryptoAmount(assetToBase(assetAmount(0)), AssetRuneNative),
    }
    const estimateADDLP = await thorchainQuery.estimateAddLP(addlp)
    printAdd(estimateADDLP)
    expect(estimateADDLP).toBeTruthy()
  })
  it(`Should estimate ADD liquidity postion for LTC & RUNE LP`, async () => {
    const addlp: AddliquidityPosition = {
      asset: new CryptoAmount(assetToBase(assetAmount(65)), AssetLTC),
      rune: new CryptoAmount(assetToBase(assetAmount(1552)), AssetRuneNative),
    }
    const estimateADDLP = await thorchainQuery.estimateAddLP(addlp)
    printAdd(estimateADDLP)
    expect(estimateADDLP).toBeTruthy()
  })

  it(`Should estimate ADD liquidity postion for BTC & RUNE LP`, async () => {
    const addlp: AddliquidityPosition = {
      asset: new CryptoAmount(assetToBase(assetAmount(0.615314)), AssetBTC),
      rune: new CryptoAmount(assetToBase(assetAmount(5480)), AssetRuneNative),
    }
    const estimateADDLP = await thorchainQuery.estimateAddLP(addlp)
    printAdd(estimateADDLP)
    expect(estimateADDLP).toBeTruthy()
  })

  // Estimate withrdaw lp positions
  it(`Should estimate withdraw BNB from address's position`, async () => {
    const percentage = 100 // gets converted to basis points later
    const assetAddress = 'bc1qzw3xhtwctpezz8m4se7hsw4y68tg42p99gtrae'
    const removeLp: WithdrawLiquidityPosition = {
      asset: AssetBTC,
      percentage: percentage,
      assetAddress: assetAddress,
    }
    const estimatRemoveLP = await thorchainQuery.estimateWithdrawLP(removeLp)
    printWithdraw(estimatRemoveLP)
    expect(estimatRemoveLP).toBeTruthy()
  })
  // Estimate withrdaw lp positions
  it(`Should estimate withdraw RUNE from address's position`, async () => {
    const percentage = 100 // gets converted to basis points later
    const removeLp: WithdrawLiquidityPosition = {
      asset: BUSD,
      percentage: percentage,
      runeAddress: 'thor14mjdjs49sa76lw3gkvj7gr6uwapxq7256rwp30',
    }
    const estimatRemoveLP = await thorchainQuery.estimateWithdrawLP(removeLp)
    printWithdraw(estimatRemoveLP)
    expect(estimatRemoveLP).toBeTruthy()
  })

  it(`Should check liquidity position for an address`, async () => {
    const address = 'thor1cf4dsll8rema8y3xvvsn2t786xrkhp3d679qxh'
    const checkLP = await thorchainQuery.checkLiquidityPosition(AssetBTC, address)
    printliquidityPosition(checkLP)
    expect(checkLP).toBeTruthy()
  })

  it(`Should estimate saver addition`, async () => {
    const addAssetAmount = new CryptoAmount(assetToBase(assetAmount(1, 8)), AssetBTC)
    const estimateAddsSaver = await thorchainQuery.estimateAddSaver(addAssetAmount)
    printSaver(estimateAddsSaver)
  })
  it(`Should estimate saver addition synth`, async () => {
    const addAssetAmount = new CryptoAmount(assetToBase(assetAmount(1, 8)), synthBTC)
    const estimateAddsSaver = await thorchainQuery.estimateAddSaver(addAssetAmount)
    printSaver(estimateAddsSaver)
  })
  it(`Should estimate saver withdrawal`, async () => {
    const addAssetAmount = new CryptoAmount(assetToBase(assetAmount(0, 8)), AssetBTC)
    const estimateWithdrawSaver = await thorchainQuery.estimateWithdrawSaver(addAssetAmount)
    printWithdrawSaver(estimateWithdrawSaver)
  })
  it(`Should get saver position`, async () => {
    const address = 'bnb1jy7h4muz0ruflmrlxnt89ayhn3mf82sgza4vfm'
    const saver: getSaver = {
      asset: AssetBNB,
      address: address,
    }
    const getSavers = await thorchainQuery.getSaverPosition(saver)
    printSaversPosition(getSavers)
  })
})
