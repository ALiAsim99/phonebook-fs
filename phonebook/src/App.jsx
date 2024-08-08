import { useEffect, useRef,useState } from "react";
import phoneService from './services/note'
import axios from "axios";
import Notification from './components/Notification'
function App(){
  const [persons,setPerson]=useState([])
  const [filter,setFilter]=useState('')
  const [msg,setMessage]=useState(null)
   const filterPerson=persons.filter(p=>p.name.includes(filter));
  useEffect(()=>{
    phoneService.getAll()
      .then(persons=>setPerson(persons))
  },[])

  return(
    <>
      <h1>Phonebook</h1>
      <Filter filter={filter} setFilter={setFilter} />
      <Notification msg={msg}/>
      <h2>add a new</h2>
      <PersonForm persons={persons} setPerson={setPerson} setMessage={setMessage}/>
      <h2>Numbers</h2>
      <Persons persons={filterPerson}  setPerson={setPerson} setMessage={setMessage}/>
    </>
  )

}

function Filter({filter,setFilter}){
   
    return(
    <>
    Filter name with <input  value={filter} onChange={(e)=>setFilter(e.target.value)}/>
    </>
  )
}

function Persons({persons,setPerson,setMessage}){
  const toggleDelete=(id)=>{
    const person=persons.find(p=>p.id==id);
    if(!person){
      throw new Error("Person doesnt exist")
    }
    if(window.confirm(`Delete ${person.name}?`)){
    phoneService.remove(person.id)
    .then(deltedPerson=>{
        console.log(deltedPerson)
      setPerson(persons.filter(p=>p.id!=id))
      setMessage(`${person.name} deleted `)
      setTimeout(()=>setMessage(null),1000)
    })
    .catch(err=>{
      console.log(err)
      setMessage(`${person.name} does not exist  `)
      setTimeout(()=>setMessage(null),1000)
      setPerson(persons.filter(p=>p.id!==id))
    })
  }
  }

  return(
    <ul>
      {persons.map(p=><li style={{listStyle:'none'}} key={p.id}>{p.name} {p.number} <button onClick={()=>toggleDelete(p.id)} style={{background:'blue',color:'white'}}>Delete</button></li>)}
    </ul>
  )
}


function PersonForm({persons,setPerson,setMessage}){
  const [name,setName]=useState('')
  const [number,setNumber]=useState('')
  const nameRef=useRef(null)
  
  const addPerson=(e)=>{
    e.preventDefault();
    const newObj={
      name,
      number
    }
    const duplicatePerson=persons.find(p=>p.name==name && p.number==number);
    const duplicatePersonName=persons.find(p=>p.name==name)
    console.log(duplicatePerson)
    if(duplicatePerson){
      alert(`${duplicatePerson.name} with ${duplicatePerson.number} already exists`)
    }else if(duplicatePersonName){
      if(window.confirm(`${name} already in the phonebook,replace the old number with the new one?`)){
        const updatePerson={
          ...duplicatePersonName,
          number
        }
        phoneService.update(updatePerson)
        .then(person=>{
          setPerson(persons.map(p=>p.id==person.id?person:p))
          setMessage(`${person.name} updated successfully`)
          setTimeout(()=>setMessage(null),1000)
        })
        setName('')
    setNumber('')
    }
    }
    else{
      phoneService.create(newObj)
      .then(person=>{
        setPerson(persons.concat(person))
        setMessage(`${person.name} added successfully`)
        setTimeout(()=>setMessage(null),1000)
      })
      setName('')
      setNumber('')
      nameRef.current.focus();
    }
  }

  return(
    <form>
      Name:<input ref={nameRef} value={name} onChange={(e)=>setName(e.target.value)}/>
      <div>
        Number :<input value={number} onChange={(e)=>setNumber(e.target.value)}/>
      </div>
      <div>      <button onClick={addPerson}>Add</button>
      </div>
    </form>
  )
}

export default App;