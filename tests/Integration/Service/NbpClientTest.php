<?php

namespace Integration\Service;

use App\Service\Nbp\ApiClient;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class NbpClientTest extends KernelTestCase
{
    private $client;

    protected function setUp(): void
    {
        self::bootKernel();

        /** @var ApiClient $client */
        $client = self::$container->get(ApiClient::class);
        $this->client = $client;
    }

    public function testGetExchangeRates(): void
    {
        $exchangeRate = $this->client->getExchangeRates(new \DateTimeImmutable('previous weekday')); //prevent from failing before 12:00 or weekends

        $this->assertArrayHasKey('table', $exchangeRate[0]);
        $this->assertArrayHasKey('no', $exchangeRate[0]);
        $this->assertArrayHasKey('effectiveDate', $exchangeRate[0]);
        $this->assertArrayHasKey('rates', $exchangeRate[0]);
        $this->assertIsArray($exchangeRate[0]['rates']);
        $this->assertArrayHasKey('currency', $exchangeRate[0]['rates'][0]);
        $this->assertArrayHasKey('code', $exchangeRate[0]['rates'][0]);
        $this->assertArrayHasKey('mid', $exchangeRate[0]['rates'][0]);
    }


}