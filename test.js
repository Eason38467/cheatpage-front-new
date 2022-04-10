const axios = require('axios')

const rest=axios.get('http://localhost:5002/api/codename').then(res=>
).then(d=> {
    console.log(d.data)
}
).catch(err=>console.log(err));


