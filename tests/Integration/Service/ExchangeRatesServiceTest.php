<?php

namespace Integration\Service;

use App\Service\Nbp\ApiClient;
use App\Service\Nbp\ExchangeRatesService;
use App\Service\Nbp\Struct\CurrencyRate;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ExchangeRatesServiceTest extends KernelTestCase
{
    private $exchangeRatesService;

    protected function setUp(): void
    {
        self::bootKernel();

        /** @var ExchangeRatesService $exchangeRatesService */
        $exchangeRatesService = self::$container->get(ExchangeRatesService::class);
        $this->exchangeRatesService = $exchangeRatesService;
    }

    public function testGetExchangeRates(): void
    {
        $exchangeRate = $this->exchangeRatesService->getExchangeRatesForDate(new \DateTime(), []);

        $this->assertEquals((new \DateTimeImmutable())->format('Y-m-d'), $exchangeRate->getDate()->format('Y-m-d')); //todo: format const or create helper

        $rates = $exchangeRate->getRates();
        $this->assertCount(5, $rates); //todo: count get from config

        foreach($rates as $rate) {
            $this->assertInstanceOf(CurrencyRate::class, $rate);
            if(in_array($rate->getCode(), ['USD', 'EUR'])) { //todo: get from config
                $this->assertEqualsWithDelta( ExchangeRatesService::BUY_SPREAD + ExchangeRatesService::SELL_SPREAD, $rate->getSellPrice() - $rate->getBuyPrice(), 0.01);
            } else {
                $this->assertNull($rate->getBuyPrice());
                $this->assertEquals(CurrencyRate::NOT_AVAILABLE, $rate->getBuyPriceFormatted());
            }
        }
    }


}