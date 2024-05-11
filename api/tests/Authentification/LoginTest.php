<?php

namespace App\Tests\Authentification;

use App\Factory\UtilisateurFactory;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Zenstruck\Browser\Test\HasBrowser;
use Zenstruck\Foundry\Test\Factories;

class LoginTest extends KernelTestCase
{
    use HasBrowser;
    use Factories;
    public function testLogin200()
    {
        $user = UtilisateurFactory::createOne([
            'password' => 'pass'
        ]);

        $json = $this->browser()
            ->post('/api/login', [
                'json' => [
                    'email' => $user->getEmail(),
                    'password' => 'pass'
                ]
            ])
            ->assertStatus(200);
    }
}