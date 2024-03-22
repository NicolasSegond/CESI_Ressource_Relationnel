<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240217105637 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE voir_ressource_ressource DROP FOREIGN KEY FK_637FD8942BCAB61E');
        $this->addSql('ALTER TABLE voir_ressource_ressource DROP FOREIGN KEY FK_637FD894FC6CD52A');
        $this->addSql('ALTER TABLE voir_ressource_utilisateur DROP FOREIGN KEY FK_129AB9B52BCAB61E');
        $this->addSql('ALTER TABLE voir_ressource_utilisateur DROP FOREIGN KEY FK_129AB9B5FB88E14F');
        $this->addSql('DROP TABLE voir_ressource_ressource');
        $this->addSql('DROP TABLE voir_ressource_utilisateur');
        $this->addSql('ALTER TABLE voir_ressource ADD utilisateur_id INT DEFAULT NULL, ADD ressource_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE voir_ressource ADD CONSTRAINT FK_C4A9BFDBFB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE voir_ressource ADD CONSTRAINT FK_C4A9BFDBFC6CD52A FOREIGN KEY (ressource_id) REFERENCES ressource (id)');
        $this->addSql('CREATE INDEX IDX_C4A9BFDBFB88E14F ON voir_ressource (utilisateur_id)');
        $this->addSql('CREATE INDEX IDX_C4A9BFDBFC6CD52A ON voir_ressource (ressource_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE voir_ressource_ressource (voir_ressource_id INT NOT NULL, ressource_id INT NOT NULL, INDEX IDX_637FD894FC6CD52A (ressource_id), INDEX IDX_637FD8942BCAB61E (voir_ressource_id), PRIMARY KEY(voir_ressource_id, ressource_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE voir_ressource_utilisateur (voir_ressource_id INT NOT NULL, utilisateur_id INT NOT NULL, INDEX IDX_129AB9B5FB88E14F (utilisateur_id), INDEX IDX_129AB9B52BCAB61E (voir_ressource_id), PRIMARY KEY(voir_ressource_id, utilisateur_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE voir_ressource_ressource ADD CONSTRAINT FK_637FD8942BCAB61E FOREIGN KEY (voir_ressource_id) REFERENCES voir_ressource (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE voir_ressource_ressource ADD CONSTRAINT FK_637FD894FC6CD52A FOREIGN KEY (ressource_id) REFERENCES ressource (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE voir_ressource_utilisateur ADD CONSTRAINT FK_129AB9B52BCAB61E FOREIGN KEY (voir_ressource_id) REFERENCES voir_ressource (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE voir_ressource_utilisateur ADD CONSTRAINT FK_129AB9B5FB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE voir_ressource DROP FOREIGN KEY FK_C4A9BFDBFB88E14F');
        $this->addSql('ALTER TABLE voir_ressource DROP FOREIGN KEY FK_C4A9BFDBFC6CD52A');
        $this->addSql('DROP INDEX IDX_C4A9BFDBFB88E14F ON voir_ressource');
        $this->addSql('DROP INDEX IDX_C4A9BFDBFC6CD52A ON voir_ressource');
        $this->addSql('ALTER TABLE voir_ressource DROP utilisateur_id, DROP ressource_id');
    }
}
