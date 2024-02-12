import React from 'react';
import LogoMinistere from "../../assets/logoMinistere.png";

const Footer = () => {
    return (
        <footer className="footer">
            <div className={"info-ministere"}>
                <img src={LogoMinistere} alt={"Logo ministère"} className={"logoMinistere"}/>
                <div className={"lien-partenaire"}>
                    <div>
                        <a href={"https://www.legifrance.gouv.fr/"}>https://www.legifrance.gouv.fr/</a>
                        <a href={"https://www.service-public.fr/"}>https://www.service-public.fr/</a>
                    </div>
                    <div>
                        <a href={"https://www.gouvernement.fr/"}>https://www.gouvernement.fr/ </a>
                        <a href={"https://www.data.gouv.fr/fr/"} style={{paddingLeft: '19px'}}>https://www.data.gouv.fr/fr/</a>
                    </div>
                </div>
            </div>
            <hr />
            <div className={"info-site"}>
                <a>© 2024 RE</a>
                <a>Mentions légales</a>
                <a>Politique de confidentialité</a>
            </div>
        </footer>
    );
};

export default Footer;
