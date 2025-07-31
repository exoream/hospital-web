import Cookies from 'js-cookie';

export const getToken = () => {
    return Cookies.get('token');
};

export const getUserFromToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // decode payload JWT
        return payload;
    } catch (e) {
        return null;
    }
};

export const getUserRole = () => {
    const user = getUserFromToken();
    return user?.role?.toLowerCase() || null;
};

export const getUserName = () => {
    const user = getUserFromToken();
    return user?.username || null;
};

export const logout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
};
