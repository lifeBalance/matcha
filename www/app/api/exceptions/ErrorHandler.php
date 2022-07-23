<?php

class ErrorHandler extends Error
{
    public static function handleError(int $errNo, string $errMsg, string $file, int $line): void
    {
        http_response_code(500); // Internal Server Error
        echo json_encode([
            'code'      => $errNo,
            'message'   => $errMsg,
            'file'      => $file,
            'line'      => $line
        ]);
        die;
    }
}
