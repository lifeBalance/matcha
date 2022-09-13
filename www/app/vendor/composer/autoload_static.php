<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit1e37e30ac2a4a240a581dcbe746a9e6c
{
    public static $classMap = array (
        'Auth' => __DIR__ . '/../..' . '/auth/Auth.php',
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
        'Database' => __DIR__ . '/../..' . '/core/Database.php',
        'ErrorHandler' => __DIR__ . '/../..' . '/api/exceptions/ErrorHandler.php',
        'ExceptionHandler' => __DIR__ . '/../..' . '/api/exceptions/ExceptionHandler.php',
        'ExpiredTokenException' => __DIR__ . '/../..' . '/api/exceptions/ExpiredTokenException.php',
        'InvalidArgumentException' => __DIR__ . '/../..' . '/api/exceptions/InvalidArgumentException.php',
        'InvalidSignatureException' => __DIR__ . '/../..' . '/api/exceptions/InvalidSignatureException.php',
        'JWT' => __DIR__ . '/../..' . '/auth/JWT.php',
        'Login' => __DIR__ . '/../..' . '/api/controllers/Login.php',
        'Logout' => __DIR__ . '/../..' . '/api/controllers/Logout.php',
        'Refresh' => __DIR__ . '/../..' . '/api/controllers/Refresh.php',
        'RefreshToken' => __DIR__ . '/../..' . '/models/RefreshToken.php',
        'Router' => __DIR__ . '/../..' . '/core/Router.php',
        'Test' => __DIR__ . '/../..' . '/api/controllers/Test.php',
        'User' => __DIR__ . '/../..' . '/api/models/User.php',
        'Users' => __DIR__ . '/../..' . '/api/controllers/Users.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->classMap = ComposerStaticInit1e37e30ac2a4a240a581dcbe746a9e6c::$classMap;

        }, null, ClassLoader::class);
    }
}
