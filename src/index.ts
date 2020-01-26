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
 * Normalize a cryptocurrency pair.
 *
 * @param rawPair The original pair of an exchange
 * @param exchange The exchange name
 */
export default function normalize(rawPair: string, exchange?: string): string {
  rawPair = rawPair.toUpperCase(); // eslint-disable-line no-param-reassign
  const normalizedPair = defaultNormalize(rawPair);

  if (!exchange) {
    if (!normalizedPair) throw new Error(`Failed to parse ${rawPair}`);
    else return normalizedPair;
  }

  let baseSymbol = '';
  let quoteSymbol = '';
  if (normalizedPair) {
    [baseSymbol, quoteSymbol] = normalizedPair!.split('_');
  }

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
      if (quoteSymbol === 'XDG') quoteSymbol = 'DOGE';

      break;
    }
    case 'Newdex': {
      const arr = rawPair.toUpperCase().split('-');
      assert.equal(arr.length, 3, `Failed to parse ${rawPair} for Newdex`);

      [, baseSymbol] = arr;

      if (baseSymbol === 'KEY') baseSymbol = 'MYKEY';
      return `${baseSymbol}_${arr[2]}`;
    }
    case 'WhaleEx': {
      if (baseSymbol === 'KEY') baseSymbol = 'MYKEY';
      break;
    }
    default:
      if (normalizedPair) return normalizedPair;
      throw new Error(`Failed to parse ${rawPair} for exchange ${exchange}`);
  }

  return `${baseSymbol}_${quoteSymbol}`;
}
