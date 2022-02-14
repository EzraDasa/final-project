export default function searchCities(arrayCities,inputCity) {
    let search =[]
    arrayCities.filter((item)=>{
        for (let i = 0; i < 1; i++) {
            if (item.english_name[i] == inputCity[i] && item.english_name.indexOf(inputCity) >-1 ) {
                search.push({name:item.english_name});
            }
            if (item.name[i] == inputCity[i] && item.name.indexOf(inputCity) >-1) {
                search.push({name:item.name});
                }
        }
   })
   return search;
}