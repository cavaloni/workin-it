import fetch from 'isomorphic-fetch';

export const login = () => {
    fetch('/login/facebook')
        .then(x => console.log(x));
}
;
