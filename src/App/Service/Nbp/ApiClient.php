<?php

namespace App\Service\Nbp;

use App\Exception\CommunicationException;
use Symfony\Contracts\HttpClient\HttpClientInterface;

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


    public function getExchangeRates(\DateTimeInterface $date): array
    {
        $response = $this->httpClient->request(
            'GET',
            sprintf("%s/%s?%s", $this->baseUrl, 'exchangerates/tables/A/' . $date->format('Y-m-d'), self::FORMAT_STRING)
        );

        if($response->getStatusCode() == 404) {
            throw new CommunicationException('Brak danych');
        } elseif($response->getStatusCode() != 200) {
            throw new CommunicationException('Błąd komunikacji NBP API');
        }

        return $response->toArray();
    }
}