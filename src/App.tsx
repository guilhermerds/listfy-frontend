import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './Pages/Home'
import { Login } from './Pages/Login'
import { Register } from './Pages/Register'
import { Lists } from './Pages/Lists'
import { ListDetails } from './Pages/ListDetails'
import { EditListItem } from './Pages/EditListItem'
import { EditList } from './Pages/EditList'
import ProtectedRoute from './Components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/lists" element={
          <ProtectedRoute><Lists /></ProtectedRoute>
        } />
        <Route path="/lists/:id" element={
          <ProtectedRoute><ListDetails /></ProtectedRoute>
        } />
        <Route path="/lists/:id/edit" element={
          <ProtectedRoute><EditList /></ProtectedRoute>
        } />
        <Route path="/lists/:id/create-item" element={
          <ProtectedRoute><EditListItem /></ProtectedRoute>
        } />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
