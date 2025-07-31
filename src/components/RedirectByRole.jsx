// components/RedirectByRole.js
import { Navigate } from 'react-router-dom';
import { getUserRole, getToken } from '../utils/auth';
import { rolePaths } from '../utils/roleRedirects';

const RedirectByRole = () => {
    const token = getToken();
    const role = getUserRole();

    if (!token || !role) {
        return <Navigate to="/login" />;
    }

    const defaultPath = rolePaths[role];

    if (defaultPath) {
        return <Navigate to={defaultPath} />;
    }

    return <Navigate to="/unauthorized" />;
};

export default RedirectByRole;
