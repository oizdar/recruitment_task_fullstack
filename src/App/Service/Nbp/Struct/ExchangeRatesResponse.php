<?php

namespace App\Service\Nbp\Struct;

class ExchangeRatesResponse
{
    private $date;

    /** @var CurrencyRate[]  */
    private $rates;

    /** @var CurrencyCalculations[]  */
    private $calculations;

    public function __construct( \DateTimeImmutable $date, array $rates)
    {
        $this->date = $date;
        $this->rates = $rates;
    }

    public function setCalculations($calculations)
    {
        $this->calculations = $calculations;
    }

    public function toArray()
    {
        return [
            'date' => $this->date->format('Y-m-d'),
            'rates' => array_map(function(CurrencyRate $rate) {
                return $rate->toArray();
            }, $this->rates),
            'calculations' => array_map(function(CurrencyCalculations $calculations) {
                return $calculations->toArray();
            }, $this->calculations),
        ];
    }

    public function getDate(): \DateTimeImmutable
    {
        return $this->date;
    }

    public function getRates(): array
    {
        return $this->rates;
    }

    //todo: create some helper functions e.g. getRateForCurrency
}