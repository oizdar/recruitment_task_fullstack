<?php

namespace App\Service\Nbp\Struct;

class CurrencyRate
{
    private $currency;
    private $code;

    private $nbpRate;
    private $buyPrice;
    private $sellPrice;

    const NOT_AVAILABLE = 'N/A';

    public function __construct(string $currency, string $code, ?float $nbpRate, ?float $buyPrice, ?float $sellPrice) //todo: better to use Money object or maybe at least int ?
    {
        $this->currency = $currency;
        $this->code = $code;
        $this->nbpRate = $nbpRate;
        $this->buyPrice = $buyPrice;
        $this->sellPrice = $sellPrice;
    }

    public function toArray(): array
    {
        return [
            'currency' => $this->getCurrency(),
            'code' => $this->getCode(),
            'nbpRate' => $this->getNbpRate(),
            'buyPrice' => $this->getBuyPrice(),
            'sellPrice' => $this->getSellPrice()
        ];
    }

    public function getCurrency(): string
    {
        return mb_convert_case($this->currency, MB_CASE_TITLE);
    }

    public function getCode(): string
    {
        return $this->code;
    }


    public function getBuyPrice(): ?float
    {
        return $this->buyPrice ? round($this->buyPrice, 5) : null;
    }


    public function getSellPrice(): ?float
    {
        return $this->sellPrice ? round($this->sellPrice, 5) : null;
    }

    public function getNbpRate(): ?float
    {
        return $this->sellPrice ? round($this->nbpRate, 5) : null;
    }

}