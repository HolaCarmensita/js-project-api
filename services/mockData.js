import data from '../data.json';
export let thoughts = data.map((item) => ({ ...item }));
