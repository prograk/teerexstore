export const formatCurrency = (price, currency) => {
    return Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(price);
}

export const isObjEmpty = (obj = {}) => {
    return Object.entries(obj).length === 0
}

export const noop = () => {}