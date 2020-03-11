<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * Encodeur de mot de passe
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)    
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        for ($u=0; $u < 10; $u++) { 

            $chrono = 1;

            $user = new User();

            $hash = $this->encoder->encodePassword($user, "password");

            $user   ->setFirstname($faker->firstName())
                    ->setLastname($faker->lastName())
                    ->setEmail($faker->email)
                    ->setPassword($hash);

            $manager->persist($user);

            for($c = 0; $c < mt_rand(7, 15); $c++){
                $customer = new Customer();
                $customer   ->setFirstname($faker->firstName())
                            ->setLastname($faker->lastName())
                            ->setCompany($faker->company())
                            ->setEmail($faker->email)
                            ->setUser($user);
    
                $manager->persist($customer);
    
                for($i = 0; $i < mt_rand(3, 10); $i++){
                    $invoice = new Invoice();
                    $invoice    ->setAmount($faker->randomFloat(2, 100, 15000))
                                ->setSentAt($faker->dateTimeBetween('-6 months'))
                                ->setStatus($faker->randomElement(['sent','paid','cancelled']))
                                ->setCustomer($customer)
                                ->setChrono($chrono);
    
                    $chrono++;
    
                    $manager->persist($invoice);
                }
    
            }


        }



        $manager->flush();
    }
}
