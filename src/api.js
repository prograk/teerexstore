import { url } from "./constants";

export const getProducts = () => {
  return fetch(url).then(res => res.json());
}