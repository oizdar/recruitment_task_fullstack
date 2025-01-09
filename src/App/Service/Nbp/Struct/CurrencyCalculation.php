<?php

namespace App\Service\Nbp\Struct;

class CurrencyCalculation
{
    private $currency;
    private $code;

    private $buyPrice;
    private $sellPrice;

    public function __construct(string $currency, string $code, ?float $buyPrice, ?float $sellPrice)
    {
        $this->currency = $currency;
        $this->code = $code;
        $this->buyPrice = $buyPrice;
        $this->sellPrice = $sellPrice;
    }

    public function toArray(): array
    {
        return [
            'currency' => $this->getCurrency(),
            'code' => $this->getCode(),
            'buyPrice' => $this->getBuyPriceFormatted(),
            'sellPrice' => $this->getSellPriceFormatted(),
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


    public function getBuyPriceFormatted():string
    {
        return $this->buyPrice ? number_format($this->buyPrice, 5, ',', '') : CurrencyRate::NOT_AVAILABLE;
    }

    public function getSellPrice(): ?float
    {
        return $this->sellPrice;
    }

    public function getSellPriceFormatted(): string
    {
        return $this->sellPrice ? number_format($this->sellPrice, 5, ',', '') : CurrencyRate::NOT_AVAILABLE;
    }

}