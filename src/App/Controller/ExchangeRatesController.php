<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\Nbp\ExchangeRatesService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class ExchangeRatesController extends AbstractController //todo abstract api controller or helper with error codes handling
{
    private $exchangeRatesService;

    public function __construct(ExchangeRatesService $exchangeRatesService)
    {
        $this->exchangeRatesService = $exchangeRatesService;
    }

    public function index(string $date): Response
    {
        $date = new \DateTimeImmutable($date);
        try {
            $this->exchangeRatesService->validateDate($date);
        } catch (\InvalidArgumentException $e) {
            return new Response(
                json_encode(['error' => $e->getMessage()]),
                Response::HTTP_UNPROCESSABLE_ENTITY,
                ['Content-type' => 'application/json']
            );
        }
        $responseContent = $this->exchangeRatesService->getExchangeRatesForDate($date);

        return new Response(
            (string)$responseContent,
            Response::HTTP_OK,
            ['Content-type' => 'application/json']
        );
    }

}
