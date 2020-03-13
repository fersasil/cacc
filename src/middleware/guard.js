import store from "@/store/store";

export const authUser = (to, from, next) => {
    if(store.userLoggedIn) next();

    const user = store.dispatch("isLoggedIn"); 


    if(user != false){
        store.dispatch("authUser", user);
        
        next(); 
    }

    next({ name: 'sign-in' });
    //verificar local storage
}

export const userNotAllowedWhenAuthenticated = (to, from, next) => {
    if(store.userLoggedIn) next(to);

    const user = store.dispatch("isLoggedIn"); 


    if(user != false){
        store.dispatch("authUser", user);
        
        next({name: "dashboard"}); 
    }

    next();
    //verificar local storage
}