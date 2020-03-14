<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber
{

    public function updateJwtData(JWTCreatedEvent $event)
    {
        // choper le user pour avoir son prénom et son nom
        $user = $event->getUser();
        // enrichir les datas pour lui injecter ces données
        $data = $event->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);

    }


}

