const API_URL = 'http://localhost:8080';
const api = axios.create({
  baseURL: API_URL,
  Headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
   (error) => {
    if(error.response){
        switch(error.response.status){
            case 401:
                authService.logout();
                window.location.href = '/login';
                break;
            case 403:
                console.error("Access forbidden");
            case 404:
                console.error("Resource not found");
            case 500:
                console.error("Internal Server Error");
                break; 
    }
  }

  else if(error.request){
    console.error("Request made but didn't get the response  "+error.request);
    }
  else{
    console.error("Error",error.message);
  
  }
  return Promise.reject(error);

})

const generateUserColor = () => {
  const color = [
    '#FF6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7',
    '#dda0dd','#98d8c8','#bb8fce','#85c1e9','#f7dc6f'
    
  ]
  return color[Math.floor(Math.random() * color.length)];
}

export const authService = { 
  login: async(username,password) => {
   try{

    const response = await api.post('/auth/login',{
      username,
      password
    });
    const userColor = generateUserColor();
    const userDate ={
      ...response.data,
      loginTime: new Date().toISOString()
    
    }

    localStorage.setItem('currentUser',JSON.stringify(userDate));
    localStorage.setItem('user',JSON.stringify(response.data));

    return {
      success: true,
      user : userData
    }

  }

  catch(error){

  console.error('Login failed',error)
  const errorMessage = error.response?.data?.message || 'Login failed , Please check your credentials ';
  throw new errorMessage;

  }
},

signup : async(username,email,password) => {
try{

  const response = await api.post('/auth/signup',{
    username,
    email,
    password
  });

  return {
    success: true,
    user: response.data

  }
  
}
catch(error){
  console.error('Signup failed',error);
  const errorMessage = error.response?.data?.message || 'Signup failed ,Please check your credentials'
  throw new errorMessage;
}


},

logout: async () => {
  try{
    await api.post('/auth/logout')
  }
  catch(error){
    console.error('Logout failed',error);
  }
  finally{
  localStorage.removeItem('currentUser');
  localStorage.removeItem('user');

 
}
},

fetchCurrentUser: async () => {
  try{
    const response = await api.get('/auth/currentuser');
    localStorage.setItem('currentUser',JSON.stringify(response.data));
    return response.data;
  }
  catch(error){
    console.error('Failed to fetch current user',error)
    if(error.response && error.response.status === 401){
      await authService.logout()
  }

}

},

getCurrentUser: () => {
  const currentUserStr = localStorage.getItem('currentUser');
  const userStr = localStorage.getItem('user');
  try{
     if(currentUserStr){
    return JSON.parse(currentUserStr);
  }
  else if(userStr){
    const userData = JSON.parse(userStr);
    const userColor = generateUserColor();
    
    return{
      ...userData,
      color:userColor
    }
  }
 return null;
  }
  catch(error){
    console.error('Failed to parse current user data',error);
    return null;
  }

  },

  isAuthenticated: () =>{
    const user = localStorage.getItem('user') || localStorage.getItem('currentUser');
    return !!user
  },


fetchPrivateMessages: async (user1,user2) => {
try{
  const response=await api.get('/api/messages/private?user1=${encodeURIComponent(user1}&user2=${encodeURIComponent(user2}')
  return response.data;
}
catch(error){

  console.error('Failed to fetch private messages',error)
  throw error;


}
}
}