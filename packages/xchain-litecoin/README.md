# `@xchainjs/xchain-client`

## Modules

- `client` - Custom client for communicating with Litecoin using [BIP39](https://github.com/bitcoinjs/bip39) [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) and [WIF](https://github.com/bitcoinjs/wif)

## Installation

```
yarn add @xchainjs/xchain-litecoin
```

Following peer dependencies have to be installed into your project. These are not included in `@xchainjs/xchain-litecoin`.

```
yarn add @xchainjs/xchain-client @xchainjs/xchain-crypto @xchainjs/xchain-util axios bitcoinjs-lib coininfo wif
```

## Documentation

### [`xchain litecoin`](http://docs.xchainjs.org/xchain-client/xchain-litecoin/)

[`How xchain-litecoin works`](http://docs.xchainjs.org/xchain-client/xchain-litecoin/how-it-works.html)\
[`How to use xchain-litecoin`](http://docs.xchainjs.org/xchain-client/xchain-litecoin/how-to-use.html)

## Service Providers

This package uses the following service providers:

| Function                    | Service     | Notes                                                                            |
| --------------------------- | ----------- | -------------------------------------------------------------------------------- |
| Balances                    | Sochain     | https://sochain.com/api#get-balance                                              |
| Transaction history         | Sochain     | https://sochain.com/api#get-display-data-address, https://sochain.com/api#get-tx |
| Transaction details by hash | Sochain     | https://sochain.com/api#get-tx                                                   |
| Transaction fees            | Bitgo       | https://app.bitgo.com/docs/#operation/v2.tx.getfeeestimate                       |
| Transaction broadcast       | Bitaps      | https://ltc.bitaps.com/broadcast                                                 |
| Explorer                    | Blockstream | https://litecoinblockexplorer.net/                                               |

Sochain API rate limits: https://sochain.com/api#rate-limits (300 requests/minute)

Bitgo API rate limits: https://app.bitgo.com/docs/#section/Rate-Limiting (10 requests/second)

Bitaps API rate limits: Standard limit 15 requests within 5 seconds for a single IP address.

### Setting Headers for Nine Realms endpoints

If you plan on using the publically accessible endpoints provided by Nine Realms(listed below), ensure that you add a valid 'x-client-id' to all requests

- https://midgard.ninerealms.com
- https://haskoin.ninerealms.com (BTC/BCH/LTC)
- https://thornode.ninerealms.com

Example

```typescript
import cosmosclient from '@cosmos-client/core'
import axios from 'axios'
import { register9Rheader } from '@xchainjs/xchain-util'

register9Rheader(axios)
register9Rheader(cosmosclient.config.globalAxios)
```

For a complete example please see this [test](https://github.com/xchainjs/xchainjs-lib/blob/master/packages/xchain-thorchain-amm/__e2e__/wallet.e2e.ts)
