<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit1e37e30ac2a4a240a581dcbe746a9e6c
{
    public static $classMap = array (
        'Auth' => __DIR__ . '/../..' . '/auth/Auth.php',
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
        'Database' => __DIR__ . '/../..' . '/core/Database.php',
        'Home' => __DIR__ . '/../..' . '/controllers/Home.php',
        'JWT' => __DIR__ . '/../..' . '/auth/JWT.php',
        'Login' => __DIR__ . '/../..' . '/controllers/Login.php',
        'Logout' => __DIR__ . '/../..' . '/controllers/Logout.php',
        'Refresh' => __DIR__ . '/../..' . '/controllers/Refresh.php',
        'RefreshToken' => __DIR__ . '/../..' . '/models/RefreshToken.php',
        'Router' => __DIR__ . '/../..' . '/core/Router.php',
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
