import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getIdUser, getRolesUser, getTokenDisconnected } from "../../utils/authentification";

const Admin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = getTokenDisconnected();
            if (!token) {
                navigate('/');
                return;
            }

            const userID = getIdUser(token);
            const rolesUser = await getRolesUser(userID);
            console.log(rolesUser);
            if (rolesUser.includes("ROLE_ADMIN") || rolesUser.includes("ROLE_MODO")) {
                setIsAdmin(true);
            } else {
                navigate('/');
            }
        };

        fetchData();
    }, [navigate]);

    if (!isAdmin) {
        return null; // Ou une indication de chargement si nécessaire
    }

    return (
        <>
            <Outlet />
        </>
    );
}

export default Admin;
