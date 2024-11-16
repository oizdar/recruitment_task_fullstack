<?php

namespace Integration\SetupCheck;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class ExchangeRatesTest extends WebTestCase
{
    private $client;

    public function setUp(): void
    {
        $this->client = static::createClient();
    }

    public function testExchangeRatesApiEndpoint(): void
    {

        $date = new \DateTimeImmutable('previous weekday'); //prevent from failing before 12:00 or weekends

        $this->client->request('GET', '/api/exchange-rates/' . $date->format('Y-m-d'));
        $this->assertResponseIsSuccessful();
        $response = $this->client->getResponse();
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

    public function testExchangeRatesApiEndpointValidationErrorWhenDayAfterToday(): void
    {
        $date = new \DateTimeImmutable('+1 day');

        $this->client->request('GET', '/api/exchange-rates/' . $date->format('Y-m-d'));
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        $response = $this->client->getResponse();
        $this->assertJson($response->getContent());
        $responseData = json_decode($response->getContent(), TRUE);
        $this->assertArrayHasKey('error', $responseData);
    }

    public function testExchangeRatesApiEndpointValidationWhenDayBefore2023(): void
    {
        $date = new \DateTimeImmutable('2022-12-31');

        $this->client->request('GET', '/api/exchange-rates/' . $date->format('Y-m-d'));
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        $response = $this->client->getResponse();
        $this->assertJson($response->getContent());
        $responseData = json_decode($response->getContent(), TRUE);
        $this->assertArrayHasKey('error', $responseData);
    }
}