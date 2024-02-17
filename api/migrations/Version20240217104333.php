<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240217104333 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE categorie (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE commentaire (id INT AUTO_INCREMENT NOT NULL, ressource_id INT DEFAULT NULL, utilisateur_id INT DEFAULT NULL, contenu VARCHAR(500) NOT NULL, INDEX IDX_67F068BCFC6CD52A (ressource_id), INDEX IDX_67F068BCFB88E14F (utilisateur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE progression (id INT AUTO_INCREMENT NOT NULL, type_progression_id INT DEFAULT NULL, utilisateur_id INT DEFAULT NULL, ressource_id INT DEFAULT NULL, INDEX IDX_D5B25073F9E1B58C (type_progression_id), INDEX IDX_D5B25073FB88E14F (utilisateur_id), INDEX IDX_D5B25073FC6CD52A (ressource_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ressource (id INT AUTO_INCREMENT NOT NULL, proprietaire_id INT NOT NULL, statut_id INT DEFAULT NULL, visibilite_id INT DEFAULT NULL, type_de_ressource_id INT DEFAULT NULL, type_relation_id INT DEFAULT NULL, categorie_id INT DEFAULT NULL, titre VARCHAR(255) NOT NULL, contenu VARCHAR(1000) NOT NULL, date_creation DATETIME NOT NULL, date_modification DATETIME NOT NULL, nombre_vue INT NOT NULL, INDEX IDX_939F454476C50E4A (proprietaire_id), INDEX IDX_939F4544F6203804 (statut_id), INDEX IDX_939F4544ADDA9FA7 (visibilite_id), INDEX IDX_939F45444998A756 (type_de_ressource_id), INDEX IDX_939F4544794F46CA (type_relation_id), INDEX IDX_939F4544BCF5E72D (categorie_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE statut (id INT AUTO_INCREMENT NOT NULL, nom_statut VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE type_de_ressource (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE type_progression (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE type_relation (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE visibilite (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE voir_ressource (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE voir_ressource_utilisateur (voir_ressource_id INT NOT NULL, utilisateur_id INT NOT NULL, INDEX IDX_129AB9B52BCAB61E (voir_ressource_id), INDEX IDX_129AB9B5FB88E14F (utilisateur_id), PRIMARY KEY(voir_ressource_id, utilisateur_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE voir_ressource_ressource (voir_ressource_id INT NOT NULL, ressource_id INT NOT NULL, INDEX IDX_637FD8942BCAB61E (voir_ressource_id), INDEX IDX_637FD894FC6CD52A (ressource_id), PRIMARY KEY(voir_ressource_id, ressource_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE commentaire ADD CONSTRAINT FK_67F068BCFC6CD52A FOREIGN KEY (ressource_id) REFERENCES ressource (id)');
        $this->addSql('ALTER TABLE commentaire ADD CONSTRAINT FK_67F068BCFB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE progression ADD CONSTRAINT FK_D5B25073F9E1B58C FOREIGN KEY (type_progression_id) REFERENCES type_progression (id)');
        $this->addSql('ALTER TABLE progression ADD CONSTRAINT FK_D5B25073FB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE progression ADD CONSTRAINT FK_D5B25073FC6CD52A FOREIGN KEY (ressource_id) REFERENCES ressource (id)');
        $this->addSql('ALTER TABLE ressource ADD CONSTRAINT FK_939F454476C50E4A FOREIGN KEY (proprietaire_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE ressource ADD CONSTRAINT FK_939F4544F6203804 FOREIGN KEY (statut_id) REFERENCES statut (id)');
        $this->addSql('ALTER TABLE ressource ADD CONSTRAINT FK_939F4544ADDA9FA7 FOREIGN KEY (visibilite_id) REFERENCES visibilite (id)');
        $this->addSql('ALTER TABLE ressource ADD CONSTRAINT FK_939F45444998A756 FOREIGN KEY (type_de_ressource_id) REFERENCES type_de_ressource (id)');
        $this->addSql('ALTER TABLE ressource ADD CONSTRAINT FK_939F4544794F46CA FOREIGN KEY (type_relation_id) REFERENCES type_relation (id)');
        $this->addSql('ALTER TABLE ressource ADD CONSTRAINT FK_939F4544BCF5E72D FOREIGN KEY (categorie_id) REFERENCES categorie (id)');
        $this->addSql('ALTER TABLE voir_ressource_utilisateur ADD CONSTRAINT FK_129AB9B52BCAB61E FOREIGN KEY (voir_ressource_id) REFERENCES voir_ressource (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE voir_ressource_utilisateur ADD CONSTRAINT FK_129AB9B5FB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE voir_ressource_ressource ADD CONSTRAINT FK_637FD8942BCAB61E FOREIGN KEY (voir_ressource_id) REFERENCES voir_ressource (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE voir_ressource_ressource ADD CONSTRAINT FK_637FD894FC6CD52A FOREIGN KEY (ressource_id) REFERENCES ressource (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE commentaire DROP FOREIGN KEY FK_67F068BCFC6CD52A');
        $this->addSql('ALTER TABLE commentaire DROP FOREIGN KEY FK_67F068BCFB88E14F');
        $this->addSql('ALTER TABLE progression DROP FOREIGN KEY FK_D5B25073F9E1B58C');
        $this->addSql('ALTER TABLE progression DROP FOREIGN KEY FK_D5B25073FB88E14F');
        $this->addSql('ALTER TABLE progression DROP FOREIGN KEY FK_D5B25073FC6CD52A');
        $this->addSql('ALTER TABLE ressource DROP FOREIGN KEY FK_939F454476C50E4A');
        $this->addSql('ALTER TABLE ressource DROP FOREIGN KEY FK_939F4544F6203804');
        $this->addSql('ALTER TABLE ressource DROP FOREIGN KEY FK_939F4544ADDA9FA7');
        $this->addSql('ALTER TABLE ressource DROP FOREIGN KEY FK_939F45444998A756');
        $this->addSql('ALTER TABLE ressource DROP FOREIGN KEY FK_939F4544794F46CA');
        $this->addSql('ALTER TABLE ressource DROP FOREIGN KEY FK_939F4544BCF5E72D');
        $this->addSql('ALTER TABLE voir_ressource_utilisateur DROP FOREIGN KEY FK_129AB9B52BCAB61E');
        $this->addSql('ALTER TABLE voir_ressource_utilisateur DROP FOREIGN KEY FK_129AB9B5FB88E14F');
        $this->addSql('ALTER TABLE voir_ressource_ressource DROP FOREIGN KEY FK_637FD8942BCAB61E');
        $this->addSql('ALTER TABLE voir_ressource_ressource DROP FOREIGN KEY FK_637FD894FC6CD52A');
        $this->addSql('DROP TABLE categorie');
        $this->addSql('DROP TABLE commentaire');
        $this->addSql('DROP TABLE progression');
        $this->addSql('DROP TABLE ressource');
        $this->addSql('DROP TABLE statut');
        $this->addSql('DROP TABLE type_de_ressource');
        $this->addSql('DROP TABLE type_progression');
        $this->addSql('DROP TABLE type_relation');
        $this->addSql('DROP TABLE visibilite');
        $this->addSql('DROP TABLE voir_ressource');
        $this->addSql('DROP TABLE voir_ressource_utilisateur');
        $this->addSql('DROP TABLE voir_ressource_ressource');
    }
}
