import React, { useEffect, useState ,useRef} from 'react';
import Addtodo from './Components/Addtodo';
import { TodoProvider } from './Context/TodoContext';
import Todod from './Components/Todod';

function App() {
  const [Todos, setTodos] = useState(() => {
    try {
      const savedTodos = JSON.parse(localStorage.getItem("Todos"));
      return savedTodos && Array.isArray(savedTodos) ? savedTodos : [];
    } catch (error) {
      console.error("Error loading Todos from localStorage:", error);
      return [];
    }
  });
  const initalPostion =useRef(null)
  const finalPositon = useRef(null)
  
  function setTodo(prop) {
    setTodos(prev => [prop, ...prev]);
  }
  //it will update the local stroagge eveytime we add new todo 
  useEffect(()=>{
    console.log("hello");

    localStorage.setItem("Todos",JSON.stringify(Todos))
  },[Todos])

  function removeTodo(id) {
    const newTodo = Todos.filter(todo => todo.id !== id);
    setTodos(newTodo);
    
  }
  //todo upatinon use map and if remove use filter (way more convinent)
  function updateTodo(id, updatedTodo) {
    setTodos(prev => prev.map(prevTodo => (prevTodo.id === id ? updatedTodo : prevTodo))); // Fixed updating logic
  }
  function toddgled(id){
    setTodos(prev=>prev.map(prevTodo=>prevTodo.id===id? {...prevTodo, completed: !prevTodo.completed}:prevTodo))
  }


  function handleDragStart(index){
    initalPostion.current=index
    console.log(index);
    

  }
  function handleDragEnter(index){
    finalPositon.current=index
    console.log(index);
    const newTodo= [...Todos]
    const dragData = newTodo[initalPostion.current]
    newTodo.splice(initalPostion.current,1)
    newTodo.splice(finalPositon,0,dragData)
    initalPostion.current=index
    setTodos(newTodo)
    
    
  }
  function handleDragEnd(){
    initalPostion.current=null
    finalPositon.current=null
  }

  
 
  return (
    <TodoProvider value={{ setTodo, removeTodo, Todos, updateTodo ,toddgled,handleDragEnd,handleDragStart,handleDragEnter}}>
      <Addtodo />
      {/* {JSON.stringify(Todos)} */}
      <div className='items-center flex flex-col'>
        {Todos.map((todo,index) => (
          <Todod key={todo.id} todo={todo} index={index} /> 
        ))}
      </div>
    </TodoProvider>
  );
}

export default App;
