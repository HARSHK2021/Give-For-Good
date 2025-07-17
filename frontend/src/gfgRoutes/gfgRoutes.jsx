const host = `${import.meta.env.VITE_BASE_URL}`;

export const GFG_ROUTES ={
    REGISTER: `${host}/api/auth/register`,
    LOGIN: `${host}/api/auth/login`,
    LOGOUT: `${host}/api/auth/logout`,
    GOOGLE_AUTH: `${host}/api/auth/google`,
    GETUSER:`${host}/api/auth/getuser`,
    

}