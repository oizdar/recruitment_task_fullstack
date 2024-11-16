<?php

namespace App\Helpers;

use Symfony\Component\HttpFoundation\Response;

class ResponseHelper
{
    public static function jsonOk(array $responseContent): Response
    {
        return new Response(
            json_encode($responseContent),
            Response::HTTP_OK,
            ['Content-type' => 'application/json']
        );
    }

    public static function jsonError(string $errorMessage, int $statusCode = Response::HTTP_BAD_REQUEST): Response
    {
        return new Response(
            json_encode(['error' => $errorMessage]),
            $statusCode,
            ['Content-type' => 'application/json']
        );
    }

    public static function unprocessableEntity(string $errorMessage)
    {
        return self::jsonError($errorMessage, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

}