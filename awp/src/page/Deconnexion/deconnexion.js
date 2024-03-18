import {redirect} from "react-router-dom";

const Deconnexion = () => {
    return (
        <>
        </>
    );
}

export default Deconnexion;

export async function loader() {
    sessionStorage.removeItem('token');

    return redirect('/connexion');
}