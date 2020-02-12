import { strict as assert } from 'assert';

const ALL_QUOTE_SYMBOLS = [
  'BNB',
  'BTC',
  'BUSD',
  'CAD',
  'CHF',
  'CNHT',
  'CUSD',
  'DAI',
  'EOS',
  'EOSDT',
  'ETH',
  'EUR',
  'EUSD',
  'GBP',
  'HT',
  'HUSD',
  'JPY',
  'MX',
  'NGN',
  'OKB',
  'PAX',
  'PAXE',
  'RUB',
  'TRX',
  'TRY',
  'TUSD',
  'USD',
  'USDC',
  'USDE',
  'USDK',
  'USDS',
  'USDT',
  'USN',
  'XCHF',
  'XLM',
  'XRP',
  'ZIG',
];

const ALL_LENGTHS = [5, 4, 3, 2];

// undefined means parse failure
function defaultNormalize(rawPair: string): string | undefined {
  rawPair = rawPair.toUpperCase(); // eslint-disable-line no-param-reassign

  if (rawPair.includes('_')) {
    if (rawPair.split('_').length !== 2) return undefined;
    return rawPair;
  }
  if (rawPair.includes('-')) {
    if (rawPair.split('-').length !== 2) return undefined;
    return rawPair.replace(/-/g, '_');
  }
  if (rawPair.includes(':')) {
    if (rawPair.split(':').length !== 2) return undefined;
    return rawPair.replace(/:/g, '_');
  }
  if (rawPair.includes('/')) {
    if (rawPair.split('/').length !== 2) return undefined;
    return rawPair.replace(/\//g, '_');
  }

  let quoteSymbol: string | undefined;

  for (let i = 0; i < ALL_LENGTHS.length; i += 1) {
    const length = ALL_LENGTHS[i];
    quoteSymbol = rawPair.slice(rawPair.length - length);
    if (ALL_QUOTE_SYMBOLS.includes(quoteSymbol)) {
      break;
    } else {
      quoteSymbol = undefined;
    }
  }
  if (!quoteSymbol) return undefined;

  const baseSymbol = rawPair.slice(0, rawPair.length - quoteSymbol.length);

  return `${baseSymbol}_${quoteSymbol}`;
}

/**
 * Normalize a cryptocurrency trade pair.
 *
 * @param rawPair The original pair of an exchange
 * @param exchange The exchange name
 */
export default function normalize(rawPair: string, exchange: string): string {
  assert.ok(exchange, 'The exchange name must NOT be empty');
  rawPair = rawPair.toUpperCase(); // eslint-disable-line no-param-reassign

  let baseSymbol = '';
  let quoteSymbol = '';

  switch (exchange) {
    case 'Bitfinex': {
      // see https://api-pub.bitfinex.com/v2/conf/pub:map:currency:sym
      const mapping: { [key: string]: string } = {
        ABS: 'ABYSS',
        AIO: 'AION',
        AMP: 'AMPL',
        ATO: 'ATOM',
        BAB: 'BCH',
        CNHT: 'CNHT',
        CSX: 'CS',
        CTX: 'CTXC',
        DAD: 'EDGE',
        DAT: 'DATA',
        DRN: 'DRGN',
        DSH: 'DASH',
        DTX: 'DT',
        EUS: 'EURS',
        EUT: 'EURT',
        GSD: 'GUSD',
        IOS: 'IOST',
        IOT: 'IOTA',
        LBT: 'LBTC',
        MIT: 'MITH',
        MNA: 'MANA',
        NCA: 'NCASH',
        OMN: 'OMNI',
        PAS: 'PASS',
        POY: 'POLY',
        QSH: 'QASH',
        QTM: 'QTUM',
        RBT: 'RBTC',
        SCR: 'XD',
        SNG: 'SNGLS',
        SPK: 'SPANK',
        STJ: 'STORJ',
        TSD: 'TUSD',
        UDC: 'USDC',
        USK: 'USDK',
        UST: 'USDT',
        UTN: 'UTNP',
        VSY: 'VSYS',
        WBT: 'WBTC',
        XCH: 'XCHF',
        YGG: 'YEED',
        YYW: 'YOYOW',
      };

      if (rawPair.includes(':')) {
        [baseSymbol, quoteSymbol] = rawPair.split(':');
      } else {
        baseSymbol = rawPair.slice(0, rawPair.length - 3);
        quoteSymbol = rawPair.slice(rawPair.length - 3);
      }

      if (baseSymbol in mapping) baseSymbol = mapping[baseSymbol];
      if (quoteSymbol in mapping) quoteSymbol = mapping[quoteSymbol];

      break;
    }
    case 'Bitstamp': {
      if (!rawPair.includes('/') && !rawPair.includes('_')) {
        baseSymbol = rawPair.substring(0, 3);
        quoteSymbol = rawPair.substring(3);
      }

      break;
    }
    case 'Kraken': {
      const QUOTE_SYMBOLS = [
        'BTC',
        'ETH',
        'EUR',
        'USD',
        'CAD',
        'CHF',
        'DAI',
        'GBP',
        'JPY',
        'USDC',
        'USDT',
      ];

      const safeCurrencyCode = (currencyId: string): string => {
        let result = currencyId;
        if (currencyId.length > 3) {
          if (currencyId.indexOf('X') === 0 || currencyId.indexOf('Z') === 0) {
            result = currencyId.slice(1);
          }
        }

        if (result === 'XBT') result = 'BTC';
        if (result === 'XDG') result = 'DOGE';

        return result;
      };

      // eslint-disable-next-line no-shadow
      baseSymbol = safeCurrencyCode(rawPair.slice(0, rawPair.length - 4));
      quoteSymbol = safeCurrencyCode(rawPair.slice(rawPair.length - 4));
      // handle ICXETH
      if (
        !QUOTE_SYMBOLS.includes(quoteSymbol) ||
        (baseSymbol.length === 2 && baseSymbol !== 'SC')
      ) {
        baseSymbol = safeCurrencyCode(rawPair.slice(0, rawPair.length - 3));
        quoteSymbol = safeCurrencyCode(rawPair.slice(rawPair.length - 3));
      }
      if (!QUOTE_SYMBOLS.includes(quoteSymbol)) {
        throw new Error(`Failed to parse Kraken raw pair ${rawPair}`);
      }

      break;
    }
    case 'Newdex': {
      const arr = rawPair.toUpperCase().split('-');
      assert.equal(arr.length, 3, `Failed to parse ${rawPair} for Newdex`);

      [, baseSymbol, quoteSymbol] = arr;

      break;
    }
    case 'Poloniex': {
      [quoteSymbol, baseSymbol] = rawPair.split('_');
      return `${baseSymbol}_${quoteSymbol}`;
    }
    case 'Upbit': {
      [quoteSymbol, baseSymbol] = rawPair.split('-');
      return `${baseSymbol}_${quoteSymbol}`;
    }
    default: {
      // see next line
    }
  }

  // default
  if (!baseSymbol || !quoteSymbol) {
    const normalizedPair = defaultNormalize(rawPair);
    if (normalizedPair === undefined) {
      throw new Error(`Failed to parse ${rawPair} of exchange ${exchange}`);
    } else {
      [baseSymbol, quoteSymbol] = normalizedPair.split('_');
    }
  }

  assert.ok(baseSymbol);
  assert.ok(quoteSymbol);

  // rename
  switch (exchange) {
    case 'Bitfinex': {
      if (baseSymbol === 'HOT') baseSymbol = 'HYDRO';
      if (baseSymbol === 'ORS') baseSymbol = 'ORSGROUP';
      break;
    }
    case 'Huobi': {
      if (baseSymbol === 'HOT') baseSymbol = 'HYDRO';
      break;
    }
    case 'Kraken': {
      if (baseSymbol === 'XBT') baseSymbol = 'BTC';
      if (baseSymbol === 'XDG') baseSymbol = 'DOGE';

      if (quoteSymbol === 'XBT') quoteSymbol = 'BTC';

      break;
    }
    case 'Newdex':
    case 'WhaleEx': {
      if (baseSymbol === 'KEY') baseSymbol = 'MYKEY';
      break;
    }
    default:
    // do nothing, no change to baseSymbol or quoteSymbol
  }

  return `${baseSymbol}_${quoteSymbol}`;
}
