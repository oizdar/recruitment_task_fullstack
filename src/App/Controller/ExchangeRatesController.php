<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\Nbp\ExchangeRatesService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ExchangeRatesController extends AbstractController //todo abstract api controller or helper with error codes handling
{
    private $exchangeRatesService;

    public function __construct(ExchangeRatesService $exchangeRatesService)
    {
        $this->exchangeRatesService = $exchangeRatesService;
    }

    public function index(Request $request): Response
    {

        $responseContent = $this->exchangeRatesService->getExchangeRatesForDate(new \DateTime());

        return new Response(
            (string)$responseContent,
            Response::HTTP_OK,
            ['Content-type' => 'application/json']
        );
    }

}
