# crypto-pair

Normalize cryptocurrency trade pairs.

## Quick start

```bash
npx crypto-pair ADABUSD --exchange Binance
```

## How to use

```javascript
/* eslint-disable import/no-unresolved,no-console,import/no-extraneous-dependencies */
const normalize = require('crypto-pair').default;

console.info(normalize('ADABUSD', 'Binance'));
```

## API Manual

There is only one API in this library:

```typescript
/**
 * Normalize a cryptocurrency trade pair.
 *
 * @param rawPair The original pair of an exchange
 * @param exchange The exchange name
 */
export default function normalize(rawPair: string, exchange: string): string;
```
