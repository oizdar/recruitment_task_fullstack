<?php

namespace App\Service\Nbp\Struct;

class CurrencyCalculations
{
    private $currency;
    private $code;
    private $calculcations;

    const NOT_AVAILABLE = 'N/A';

    public function __construct(string $currency, string $code, ?array $calculations)
    {
        $this->currency = $currency;
        $this->code = $code;
        $this->calculcations = $calculations;
    }

    public function toArray(): array
    {
        return [
            'currency' => $this->getCurrency(),
            'code' => $this->getCode(),
            'calculation' => array_map(function(CurrencyCalculation $calculations) {
                return $calculations->toArray();
            }, $this->calculcations)
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

}