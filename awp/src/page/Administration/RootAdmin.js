import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Admin = (props) => {
    console.log("props", props);
    const { roles } = props;
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!roles.includes("ROLE_ADMIN")) {
            navigate("/");
        }
    }, [roles, navigate]);

    return (
        <>
            <Outlet />
        </>
    );
}

export default Admin;
