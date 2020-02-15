# crypto-pair

Normalize cryptocurrency trade pairs.

## Quick start

```bash
npx crypto-pair ADABUSD --exchange Binance
```

## How to use

```javascript
/* eslint-disable import/no-unresolved,no-console,import/no-extraneous-dependencies */
const { normalizePair } = require('crypto-pair');

console.info(normalizePair('ADABUSD', 'Binance'));
```

## API Manual

There are only two APIs in this library:

```typescript
/**
 * Normalize a symbol.
 *
 * @param symbol The original symbol from an exchange
 * @param exchange The normalized symbol
 */
export declare function normalizeSymbol(symbol: string, exchange: string): string;
/**
 * Normalize a cryptocurrency trade pair.
 *
 * @param rawPair The original pair of an exchange
 * @param exchange The exchange name
 */
export declare function normalizePair(rawPair: string, exchange: string): string;
```
