<?php

namespace App\Tests\Authentification;

use App\Factory\UtilisateurFactory;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Zenstruck\Browser\Json;
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
            ->assertStatus(200)
            ->json()
            ->assertHas('token')
            ->assertHas('refresh_token');

        assert($json instanceof Json);

        $this->assertMatchesRegularExpression('/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/', $json->decoded()['token']);


        $payload = $json->decoded()['token'];
        $payload = explode('.', $payload)[1];
        $payload = base64_decode($payload);
        $payload = json_decode($payload, true);


        $this->assertArrayHasKey('user', $payload);
        $this->assertArrayHasKey('roles', $payload);
    }

    public function testLoginMotDePasseFaux401()
    {
        $user = UtilisateurFactory::createOne([
            'password' => 'pass',
            'verif' => 1
        ]);

        $json = $this->browser()
            ->post('/api/login', [
                'json' => [
                    'email' => $user->getEmail(),
                    'password' => 'password'
                ]
            ])
            ->assertStatus(401)
            ->json()
            ->assertHas('message')
            ->assertHas('code');

        assert($json instanceof Json);

        $this->assertEquals('Invalid credentials.', $json->decoded()['message']);
    }

    public function testLoginIdentifiantsFaux401()
    {
        $user = UtilisateurFactory::createOne([
            'password' => 'pass',
            'verif' => 1
        ]);

        $json = $this->browser()
            ->post('/api/login', [
                'json' => [
                    'email' => 'nicolas@gmail.com',
                    'password' => 'password'
                ]
            ])
            ->assertStatus(401)
            ->json()
            ->assertHas('message')
            ->assertHas('code');

        assert($json instanceof Json);

        $this->assertEquals('Invalid credentials.', $json->decoded()['message']);
    }

    public function testLoginNonVérifier401()
    {
        $user = UtilisateurFactory::createOne([
            'password' => 'pass',
            'verif' => 0
        ]);

        $json = $this->browser()
            ->post('/api/login', [
                'json' => [
                    'email' => $user->getEmail(),
                    'password' => 'pass'
                ]
            ])
            ->assertStatus(401)
            ->json()
            ->assertHas('detail');

        assert($json instanceof Json);

        $this->assertEquals('Votre compte n\'est pas encore vérifié.', $json->decoded()['detail']);
    }

    public function testLoginBannis401()
    {
        $user = UtilisateurFactory::createOne([
            'password' => 'pass',
            'verif' => 2
        ]);

        $json = $this->browser()
            ->post('/api/login', [
                'json' => [
                    'email' => $user->getEmail(),
                    'password' => 'pass'
                ]
            ])
            ->assertStatus(401)
            ->json()
            ->assertHas('detail');

        assert($json instanceof Json);

        $this->assertEquals('Votre compte a été bloqué.', $json->decoded()['detail']);
    }
}