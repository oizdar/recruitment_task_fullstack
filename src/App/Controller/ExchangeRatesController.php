<?php

declare(strict_types=1);

namespace App\Controller;

use App\Exception\CommunicationException;
use App\Helpers\ResponseHelper;
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
        } catch (\InvalidArgumentException|CommunicationException $e) {
            return ResponseHelper::unprocessableEntity($e->getMessage());
        } catch (\Exception $e) {
            return ResponseHelper::jsonError('Server error', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ResponseHelper::jsonOk($responseContent->toArray());
    }


    public function latest(): Response
    {
        try {
            $responseContent = $this->exchangeRatesService->getLatestExchangeRates();
        } catch (CommunicationException $e) {
            return ResponseHelper::unprocessableEntity($e->getMessage());
        } catch (\Exception $e) {
            return ResponseHelper::jsonError('Server error', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ResponseHelper::jsonOk($responseContent->toArray());
    }
}
