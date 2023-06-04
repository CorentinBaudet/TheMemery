// import { useEffect, useState } from "react";

// //stocker le token dans le navigateur
// function useLocalState(defaultValue, key) {
//   const [value, setValue] = useState(() => {
//     const localStorageValue = localStorage.getItem(key);
//         return localStorageValue !== null ? JSON.parse(localStorageValue) : defaultValue;
//     });

//     useEffect(() => {
//         localStorage.setItem(key, JSON.stringify(value));
//     }, [key, value]);

//   return [value, setValue];
// }

// export { useLocalState };
