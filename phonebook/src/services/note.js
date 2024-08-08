import axios from "axios"

const baseUrl='http://localhost:3001/api/persons'

const getAll=()=>{
    const req=axios.get(baseUrl)
    return req.then(res=>res.data)
}

const create=(newOjb)=>{
    const req=axios.post(baseUrl,newOjb)
    return req.then(res=>res.data)
}

const remove=(id)=>{
    const req=axios.delete(`${baseUrl}/${id}`)
    return req.then(res=>res.data)
}
const update=(newObj)=>{
    const id=newObj.id;
    const req=axios.put(`${baseUrl}/${id}`,newObj)
    return req.then(res=>res.data)
}
export default {
    getAll,
    create,
    remove,
    update
}