
const url = 'https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json';

export const getProducts = () => {
    return fetch(url).then(res => res.json())
}