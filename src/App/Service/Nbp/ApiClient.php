<?php

namespace App\Service\Nbp;

use App\Exception\CommunicationException;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class ApiClient
{
    private $baseUrl;
    private $httpClient;
    private const FORMAT_STRING = 'format=json';

    public function __construct(
        string $baseUrl,
        HttpClientInterface $httpClient
    ) {
        $this->baseUrl = $baseUrl;
        $this->httpClient = $httpClient;
    }

    /**
     * @throws CommunicationException
     */
    public function getExchangeRates(\DateTimeInterface $date): array
    {
        $response = $this->httpClient->request(
            'GET',
            sprintf("%s/%s?%s", $this->baseUrl, 'exchangerates/tables/A/' . $date->format('Y-m-d'), self::FORMAT_STRING)
        );

        $this->handleResponseErrors($response);

        return $response->toArray();
    }

    /**
     * @throws CommunicationException
     */
    public function getLatestExchangeRates(): array
    {
        $response = $this->httpClient->request(
            'GET',
            sprintf("%s/%s?%s", $this->baseUrl, 'exchangerates/tables/A/', self::FORMAT_STRING)
        );

        $this->handleResponseErrors($response);

        return $response->toArray();
    }

    /**
     * @throws CommunicationException
     */
    private function handleResponseErrors(ResponseInterface $response)
    {
        if($response->getStatusCode() == 404) {
            throw new CommunicationException('Brak danych dla podanej daty');
        } elseif($response->getStatusCode() != 200) {
            throw new CommunicationException('Błąd komunikacji NBP API');
        }

        //todo handle logging, more variants with different Exception types
    }
}