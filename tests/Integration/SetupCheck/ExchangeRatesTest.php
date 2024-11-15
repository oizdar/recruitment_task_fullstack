<?php

namespace Integration\SetupCheck;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ExchangeRatesTest extends WebTestCase
{
    public function testExchangeRatesApiEndpoint(): void
    {
        $client = static::createClient();

        // test e.g. the profile page
        $client->request('GET', '/api/exchange-rates');
        $this->assertResponseIsSuccessful();
        $response = $client->getResponse();
        $this->assertJson($response->getContent());
        $responseData = json_decode($response->getContent(), TRUE);
        $this->assertArrayHasKey('date', $responseData);
        $this->assertArrayHasKey('rates', $responseData);
        $this->assertIsArray($responseData['rates']);
        $this->assertArrayHasKey('currency', $responseData['rates'][0]);
        $this->assertArrayHasKey('code', $responseData['rates'][0]);
        $this->assertArrayHasKey('buyPrice', $responseData['rates'][0]);
        $this->assertArrayHasKey('sellPrice', $responseData['rates'][0]);
    }
}