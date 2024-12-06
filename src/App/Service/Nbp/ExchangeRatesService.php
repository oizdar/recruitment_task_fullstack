<?php

namespace App\Service\Nbp;

use App\Exception\CommunicationException;
use App\Service\Nbp\Struct\CurrencyCalculation;
use App\Service\Nbp\Struct\CurrencyCalculations;
use App\Service\Nbp\Struct\CurrencyRate;
use App\Service\Nbp\Struct\ExchangeRatesResponse;
use App\Validator\DateRangeValidator;

class ExchangeRatesService
{
    private $availableCurrencies;
    private $defaultSpread;
    private $customSpread;
    private $nbpApiClient;

    public function __construct( //nice to map to config object instead arrays
        array $availableCurrencies,
        array $defaultSpread,
        array $customSpread,
        ApiClient $nbpApiClient
    ) {
        $this->availableCurrencies = $availableCurrencies;
        $this->defaultSpread = $defaultSpread;
        $this->customSpread = $customSpread;
        $this->nbpApiClient = $nbpApiClient;
    }


    /**
     * @throws CommunicationException
     */
    public function getExchangeRatesForDate(?\DateTimeInterface $date): ExchangeRatesResponse
    {
        $apiResponse = $this->nbpApiClient->getExchangeRates($date);

        return $this->mapByAvailableCurrencies($apiResponse);

    }

    /**
     * @throws CommunicationException
     */
    public function getLatestExchangeRates()
    {
        $apiResponse = $this->nbpApiClient->getLatestExchangeRates();

        return $this->mapByAvailableCurrencies($apiResponse);
    }

    private function mapByAvailableCurrencies(array $apiResposne): ExchangeRatesResponse
    {
        $rates = [];
        foreach($apiResposne[0]['rates'] as $rate) {
            if(!in_array($rate['code'], $this->availableCurrencies)) {
                continue;
            }

            $spread = $this->customSpread[$rate['code']] ?? $this->defaultSpread;
            $currencyRate = new CurrencyRate(
                $rate['currency'],
                $rate['code'],
                // don't like floats here, nice to cast to Money object PLN here before calculations
                $rate['mid'],
                !empty($spread['buy']) ? $rate['mid'] - (float)$spread['buy'] : null,
                !empty($spread['sell']) ? $rate['mid'] + (float)$spread['sell'] : null
            );
            $rates[] = $currencyRate;
        }


        $exchangeRates = new ExchangeRatesResponse(
            new \DateTimeImmutable($apiResposne[0]['effectiveDate']),
            $rates
        );


        $exchangeRates->setCalculations($this->calculateRatesByThemselves($rates));

        return $exchangeRates;
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

    /**
     * @param $rates array<CurrencyRate>
     */
    private function calculateRatesByThemselves(array $rates)
    {
        $result = [];
        foreach($rates as $rate) {
            $calculations = [];
            foreach ($rates as $secondRate) {
                if($rate->getCode() === $secondRate->getCode()) {
                    continue;
                }
                $calculations[] = new CurrencyCalculation(
                    $secondRate->getCurrency(),
                    $secondRate->getCode(),
                    $rate->getBuyPrice() && $secondRate->getSellPrice() ?  $secondRate->getSellPrice() / $rate->getBuyPrice() : null,
                    $rate->getSellPrice() && $secondRate->getBuyPrice() ? $secondRate->getBuyPrice() / $rate->getSellPrice() : null
                );
            }

            $result[] = new CurrencyCalculations(
                $rate->getCurrency(),
                $rate->getCode(),
                $calculations
            );
        }
        return $result;
    }
}