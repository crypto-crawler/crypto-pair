import fs from 'fs';
import each from 'jest-each';
import normalize from '../src/index';

const SUPPORTED_EXCHANGES = [
  'Binance',
  'Bitfinex',
  'Bitstamp',
  'Coinbase',
  'Huobi',
  'Kraken',
  'MXC',
  'Newdex',
  'OKEx_Spot',
  'WhaleEx',
];

each(SUPPORTED_EXCHANGES).test('normalize() should return the same result', (exchange: string) => {
  const file = `./tests/data/${exchange}.json`;

  const mapping = JSON.parse(fs.readFileSync(file, 'utf8')) as { [key: string]: string };

  Object.keys(mapping).forEach(pair => {
    const rawPair = mapping[pair];
    expect(normalize(rawPair, exchange)).toBe(pair); // eslint-disable-line jest/no-standalone-expect
  });
});
