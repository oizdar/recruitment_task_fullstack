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

        $this->client = self::$container->get(ApiClient::class);
    }

    public function testGetExchangeRates(): void
    {
        $exchangeRate = $this->client->getExchangeRates();

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