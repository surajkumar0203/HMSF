export const storeTheme = (name,value) =>{
    localStorage.setItem(name,value)
}

export const getTheme = (name) => {
    const theme  = localStorage.getItem(name)
    return theme;
}


export const storeToken = (token) => {
    if(token) {
        const {access,refresh} = token;
        localStorage.setItem('hmsaccess',access)
        localStorage.setItem('hmsrefresh',refresh)
        
    }
}


export const getToken = () => {
    const access = localStorage.getItem('hmsaccess')
    const refresh = localStorage.getItem('hmsrefresh')
    return {access,refresh}
}

export const removeToken = () => {
    
    localStorage.removeItem('hmsaccess')
    localStorage.removeItem('hmsrefresh')
}