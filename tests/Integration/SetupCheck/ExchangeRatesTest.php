<?php

namespace Integration\SetupCheck;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class ExchangeRatesTest extends WebTestCase
{
    public function testExchangeRatesApiEndpoint(): void
    {
        $client = static::createClient();

        $date = new \DateTimeImmutable('-1 day'); //prevent from failing before 12:00

        // test e.g. the profile page
        $client->request('GET', '/api/exchange-rates/' . $date->format('Y-m-d'));
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

    public function testExchangeRatesApiEndpointValidationDayAfterToday(): void
    {
        $client = static::createClient();

        $date = new \DateTimeImmutable('+1 day'); //prevent from failing before 12:00
        // test e.g. the profile page
        $client->request('GET', '/api/exchange-rates/' . $date->format('Y-m-d'));
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        $response = $client->getResponse();
        $this->assertJson($response->getContent());
        $responseData = json_decode($response->getContent(), TRUE);
        $this->assertArrayHasKey('error', $responseData);
    }

    public function testExchangeRatesApiEndpointValidationDayBefore2023(): void
    {
        $client = static::createClient();

        $date = new \DateTimeImmutable('2022-12-31'); //prevent from failing before 12:00
        // test e.g. the profile page
        $client->request('GET', '/api/exchange-rates/' . $date->format('Y-m-d'));
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        $response = $client->getResponse();
        $this->assertJson($response->getContent());
        $responseData = json_decode($response->getContent(), TRUE);
        $this->assertArrayHasKey('error', $responseData);
    }
}