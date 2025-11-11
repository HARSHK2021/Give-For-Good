const host = `${import.meta.env.VITE_BASE_URL}`;

export const GFG_ROUTES ={
    REGISTER: `${host}/api/auth/register`,
    LOGIN: `${host}/api/auth/login`,
    LOGOUT: `${host}/api/auth/logout`,
    GOOGLE_AUTH: `${host}/api/auth/google`,
    GETUSER:`${host}/api/auth/getuser`,
    VERIFYTOKEN:`${host}/api/auth/verifyToken`,

    //
    ADDITEM:`${host}/api/items/addItem`,
    SEARCHITEMS:`${host}/api/items/getItems`,
    GETITEMDETAILS: (id) => `${host}/api/items/getitem/${id}`,


    ADDFAVORITES:`${host}/api/items/addToFavorites`,
    REMOVEFAVORITES:`${host}/api/items/removeFromFavorites`,
    GETFAVORITES:`${host}/api/items/getFavorites`,


    //// 
    GETUSERPROFILE: (id) => `${host}/api/user/profile/get/${id}`,
    UPDATEUSERPROFILE: `${host}/api/user/profile/update`,
    FOLLOWUSER: (id) => `${host}/api/user/profile/follow/${id}`,
    UNFOLLOWUSER: (id) => `${host}/api/user/profile/unfollow/${id}`,


    GETMYLISTINGS: (id) => `${host}/api/user/profile/mylistings/${id}`,
    DELETEITEM: (id) => `${host}/api/items/deleteItem/${id}`,
    SOCKET_URL: 'https://give-for-good.onrender.com' || 'http://localhost:3000',
    // Add more routes as needed
    GETMESSAGES: (conversationId) => `${host}/api/messages/${conversationId}`,
    GETUSERCONVERSATIONS:(id) => `${host}/api/conversations/get/${id}`,
    GETCONVERSATION:`${host}/api/conversations/getConversation`,
    DELETECONVERSATION: (conversationId) => `${host}/api/conversations/delete/${conversationId}`,
    
    

}