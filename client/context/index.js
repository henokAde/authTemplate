import {useReducer, createContext, useEffect} from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';

//initial state 
const initialState = {
    user:null,
};

// create context 
const Context = createContext();

//root reducer
const rootReducer = (state, action) =>{
    switch (action.type) {
        case "LOGIN":
        return {...state, user: action.payload}

        case "LOGOUT":
        return {...state, user:null};


        default: 
        return state
    }
};


//context provider 
const Provider = ({children}) =>{
    const [state, dispatch] = useReducer(rootReducer, initialState);

    // router 
    const router = useRouter()

    useEffect(() =>{
        dispatch({
            type: "LOGIN",
            payload:JSON.parse(window.localStorage.getItem('user'),)
        })
    }, []);

    axios.interceptors.response.use(
        function(response) {
            // any status code that 
            // lie within the rante of 
            // 2xx cause this function to trigger
            return response;

        },
        function(error) {
            // any status codes that falss outside the range of 2xx 
            // cause this function 
            // to trigger
            let res = error.response
            if (res.status == 401 && response.config && !res.config.__isRetryRequest){
                return new Promise((resolve, reject) =>{
                    axios.get('/api/logout')
                    .then((data) =>{
                        console.log('/401 erro > legout');
                        dispatch({type: 'LOGOUT'});
                        window.localStorage.removeItem("user");
                        router.push('/login')
                    })
                    .catch(err =>{
                        console.log('Axios Interceptor err', err);
                        reject (error);
                    })
                })
            }

            return Promise.reject(error);
        }
        );

    useEffect(() =>{
        const getCsrfToken = async () =>{
            const {data} = await axios.get('/api/csrf-token');
            axios.defaults.headers['X-CSRF-Token'] = data.csrfToken;
        };
        getCsrfToken();
    }, []);

    return(
        <Context.Provider value={{state, dispatch}}>
            {children}
        </Context.Provider>
    );
};

export {Context, Provider}