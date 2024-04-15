<?php

namespace App\ApiPlatform\Decorator;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\PathItem;
use ApiPlatform\OpenApi\Model\RequestBody;
use ApiPlatform\OpenApi\OpenApi;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;
use Symfony\Component\HttpFoundation\Response;

#[AsDecorator(decorates: OpenApiFactoryInterface::class, priority: -10000)]
class voirRessourceDecorator implements OpenApiFactoryInterface
{
    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = $this->decorated->__invoke($context);

        $openApi
            ->getPaths()
            ->getPath('/api/voir_ressources/{id}/voir')(new PathItem())->withDelete(
                (new Operation())
                    ->withOperationId('delete_voir_ressource')
                    ->withTags(['Ressource'])
                    ->withParameters([
                        [
                            'name' => 'id',
                            'in' => 'path',
                            'required' => true,
                            'description' => 'ID de la ressource',
                            'schema' => [
                                'type' => 'integer',
                                'format' => 'int64',
                            ],
                        ],
                        [
                            'name' => 'userId',
                            'in' => 'query',
                            'required' => true,
                            'description' => "L'ID de l'utilisateur à saisir",
                            'schema' => [
                                'type' => 'integer',
                                'format' => 'int64',
                            ],
                        ],
                    ])
                    ->withResponses([
                        Response::HTTP_OK => [
                            'description' => 'Supprimer le partage à un utilisateur',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'message' => [
                                                'readOnly' => true,
                                                'type' => 'string',
                                                'nullable' => false,
                                            ],
                                        ],
                                        'required' => ['messages'],
                                    ],
                                ],
                            ],
                        ],
                    ])
                    ->withSummary('Supprimer le partage à un utilisateur')
                    ->withDescription('Supprimer le partage à un utilisateur')
                    ->withRequestBody(
                        (new RequestBody())
                            ->withDescription('Les données de suppression')
                    )
            );

        return $openApi;
    }
}
