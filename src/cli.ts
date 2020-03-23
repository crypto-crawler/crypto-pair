#!/usr/bin/env node
import yargs from 'yargs';
import { normalizePair } from './index';

const EXCHANGES = [
  'Biki',
  'Binance',
  'Bitfinex',
  'Bitstamp',
  'Coinbase',
  'Coincheck',
  'Huobi',
  'Kraken',
  'MXC',
  'Newdex',
  'OKEx_Spot',
  'Poloniex',
  'Upbit',
  'WhaleEx',
  'Zaif',
  'ZB',
  'bitFlyer',
];

const { argv } = yargs
  // eslint-disable-next-line no-shadow
  .command('$0 <raw_pair> [exchange]', 'Normalize a pair', (yargs) => {
    yargs
      .positional('raw_pair', {
        type: 'string',
        describe: 'The raw pair',
      })
      .options({
        exchange: {
          choices: EXCHANGES,
          type: 'string',
          demandOption: false,
        },
      });
  });

console.info(normalizePair(argv.raw_pair as string, argv.exchange as string));
