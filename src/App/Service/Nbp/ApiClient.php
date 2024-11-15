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


    public function getExchangeRates(): array
    {
        $response = $this->httpClient->request(
            'GET',
            sprintf("%s/%s?%s", $this->baseUrl, 'exchangerates/tables/A', self::FORMAT_STRING)
        );

        if($response->getStatusCode() !== 200) {
            throw new CommunicationException('Failed to communicate with NBP API'); //we can catch more specific exceptions here
        }

        return $response->toArray();
    }
}