<?php

namespace App\Service\Nbp;

use App\Service\Nbp\Struct\CurrencyRate;
use App\Service\Nbp\Struct\ExchangeRatesResponse;

class ExchangeRatesService
{

    //todo: move to config
    const USD = 'USD';
    const EUR = 'EUR';
    const CZK = 'CZK';
    const IDR = 'IDR';
    const BRL = 'BRL';

    const CURRENCIES = [
        self::USD,
        self::EUR,
        self::CZK,
        self::IDR,
        self::BRL
    ];

    const BUY_SPREAD = 0.05;
    const SELL_SPREAD = 0.07;
    const DEFAULT_SPREAD_SELL = 0.15;
    const DEFAULT_SPREAD_BUY = null;

    const SPREAD = [
        self::EUR => [
            'buy' => self::BUY_SPREAD,
            'sell' => self::SELL_SPREAD
        ],
        self::USD => [
            'buy' => self::BUY_SPREAD,
            'sell' => self::SELL_SPREAD
        ],
        'default' => [
            'buy' => self::DEFAULT_SPREAD_BUY,
            'sell' => self::DEFAULT_SPREAD_SELL
        ]
    ];


    public function __construct(
        ApiClient $nbpClient
    ) {
        $this->nbpClient = $nbpClient;
    }


    public function getExchangeRatesForDate(?\DateTimeInterface $date): ExchangeRatesResponse //todo otpional filters? +/-
    {
        $apiResponse = $this->nbpClient->getExchangeRates();

        return $this->mapByAvailableCurrencies($apiResponse);

    }

    private function mapByAvailableCurrencies(array $apiResposne): ExchangeRatesResponse
    {
        $rates = [];
        foreach($apiResposne[0]['rates'] as $rate) {
            if(in_array($rate['code'], self::CURRENCIES)) {
                switch ($rate['code']) {
                    case self::EUR:
                    case self::USD:
                        $spread = self::SPREAD[$rate['code']];
                        break;
                    default:
                        $spread = self::SPREAD['default'];
                }

                $currencyRate = new CurrencyRate(
                    $rate['currency'],
                    $rate['code'],
                    // don't like floats here, nice to cast to Money object PLN here before calculations
                    isset($spread['buy']) ? $rate['mid'] - $spread['buy'] : null,
                    isset($spread['sell']) ? $rate['mid'] + $spread['sell'] : null
                );

                $rates[] = $currencyRate;
            }
        }

        return new ExchangeRatesResponse(
            new \DateTimeImmutable($apiResposne[0]['effectiveDate']),
            $rates
        );
    }
}