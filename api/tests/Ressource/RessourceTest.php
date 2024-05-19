<?php

namespace App\Tests\Ressource;

use App\Factory\RessourceFactory;
use App\Factory\UtilisateurFactory;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Zenstruck\Browser\Test\HasBrowser;
use Zenstruck\Foundry\Test\Factories;

class RessourceTest extends KernelTestCase
{
    use Factories;
    use HasBrowser;

    public function setUpToken(): mixed
    {
        $user = UtilisateurFactory::createOne([
            'password' => 'pass',
        ]);

        $json = $this->browser()
            ->post('/api/login', [
                'json' => [
                    'email' => $user->getEmail(),
                    'password' => 'pass',
                ],
            ])
            ->json();

        return $json->decoded()['token'];
    }

    public function testGetRessource200()
    {
        $ressource = RessourceFactory::createMany(10);

        $json = $this->browser()
            ->get('/api/ressources')
            ->assertStatus(200)
            ->json()
            ->assertHas('hydra:member')
            ->assertHas('hydra:totalItems');
    }

    public function testGetRessourceWithID200()
    {
        $ressource = RessourceFactory::createOne();

        $response = $this->browser()
            ->get('/api/ressources/' . $ressource->getId())
            ->assertStatus(200)
            ->json()
            ->assertHas('id');

        $data = $response->decoded();

        $this->assertArrayHasKey('id', $data);
    }

    public function testGetRessourceWithParameters200()
    {

        $client = new \GuzzleHttp\Client(['base_uri' => 'http://localhost:8000']);
        $response = $client->request('GET', '/api/ressources', [
            'query' => ['statut' => 1],
            'http_errors' => false,
        ]);

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('hydra:member', $json);
        $this->assertArrayHasKey('hydra:totalItems', $json);

        foreach ($json['hydra:member'] as $ressource) {
            $this->assertEquals(1, $ressource['statut']['id']);
        }
    }

    public function testGetRessourceWithTwoParameters200()
    {

        $client = new \GuzzleHttp\Client(['base_uri' => 'http://localhost:8000']);
        $response = $client->request('GET', '/api/ressources', [
            'query' => ['statut' => 1, 'visibilite' => 1],
            'http_errors' => false,
        ]);

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('hydra:member', $json);
        $this->assertArrayHasKey('hydra:totalItems', $json);

        foreach ($json['hydra:member'] as $ressource) {
            $this->assertEquals(1, $ressource['statut']['id']);
            $this->assertEquals('/api/visibilites/1', $ressource['visibilite']['@id']);
        }
    }

    public function testGetRessourceWithThreeParameters200()
    {

        $client = new \GuzzleHttp\Client(['base_uri' => 'http://localhost:8000']);
        $response = $client->request('GET', '/api/ressources', [
            'query' => ['statut' => 1, 'visibilite' => 1, 'typeDeRessource' => 1],
            'http_errors' => false,
        ]);

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('hydra:member', $json);
        $this->assertArrayHasKey('hydra:totalItems', $json);

        foreach ($json['hydra:member'] as $ressource) {
            $this->assertEquals(1, $ressource['statut']['id']);
            $this->assertEquals('/api/visibilites/1', $ressource['visibilite']['@id']);
            $this->assertEquals('/api/type_de_ressources/1', $ressource['typeDeRessource']['@id']);
        }
    }
}