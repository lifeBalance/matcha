<?php

class ExceptionHandler extends Exception
{
    public static function handleException(Throwable $exception): void
    {
        http_response_code(500); // Internal Server Error
        echo json_encode([
            'code'      => $exception->getCode(),
            'message'   => $exception->getMessage(),
            'file'      => $exception->getFile(),
            'line'      => $exception->getLine()
        ]);
    }
}
