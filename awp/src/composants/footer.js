import React from 'react';

const Footer = () => {
    return (
        <footer style={footerStyle}>
            <p>© 2024 Votre Nom. Tous droits réservés.</p>
        </footer>
    );
};

const footerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '1rem',
    textAlign: 'center',
};

export default Footer;
