
export default function totalCheck (array){
if (array.length < 1) {
    return 0;
  } else {
    const [{ totalItems }] = array;
    return totalItems;
  }}

