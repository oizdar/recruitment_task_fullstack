<?php

declare(strict_types=1);

namespace App\Controller;

use App\Exception\CommunicationException;
use App\Service\Nbp\ExchangeRatesService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class ExchangeRatesController extends AbstractController //todo abstract api controller or helper with response handling helper methods
{
    private $exchangeRatesService;

    public function __construct(ExchangeRatesService $exchangeRatesService)
    {
        $this->exchangeRatesService = $exchangeRatesService;
    }

    public function index(string $date): Response
    {
        try {
            $date = new \DateTimeImmutable($date);
            $this->exchangeRatesService->validateDate($date);
            $responseContent = $this->exchangeRatesService->getExchangeRatesForDate($date);
        } catch (\InvalidArgumentException $e) {
            return new Response(
                json_encode(['error' => $e->getMessage()]),
                Response::HTTP_UNPROCESSABLE_ENTITY,
                ['Content-type' => 'application/json']
            );
        } catch (CommunicationException $e) {
            return new Response(
                json_encode(['error' => $e->getMessage()]),
                Response::HTTP_UNPROCESSABLE_ENTITY, //can use other code
                ['Content-type' => 'application/json']
            );
        }

        return new Response(
            (string)$responseContent,
            Response::HTTP_OK,
            ['Content-type' => 'application/json']
        );
    }

}
