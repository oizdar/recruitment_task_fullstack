<?php

namespace App\Service\Nbp;

use App\Exception\CommunicationException;
use App\Service\Nbp\Struct\CurrencyRate;
use App\Service\Nbp\Struct\ExchangeRatesResponse;
use App\Validator\DateRangeValidator;

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


    /**
     * @throws CommunicationException
     */
    public function getExchangeRatesForDate(?\DateTimeInterface $date): ExchangeRatesResponse
    {
        $apiResponse = $this->nbpClient->getExchangeRates($date);

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
                    $rate['mid'],
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

    public function validateDate(\DateTimeInterface $date): bool
    {
        $actualRateDate = new \DateTimeImmutable();
        if ($actualRateDate < new \DateTimeImmutable('12:00')) {
            $actualRateDate = $actualRateDate->modify('-1 day');
        }
        $dateValidator = new DateRangeValidator(new \DateTimeImmutable('2023-01-01'), $actualRateDate);
        return $dateValidator->validate($date);
    }
}