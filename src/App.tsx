import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './Pages/Home'
import { Login } from './Pages/Login'
import { Register } from './Pages/Register'
import { Lists } from './Pages/Lists'
import { ListDetails } from './Pages/ListDetails'
import ProtectedRoute from './Components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import { Helmet } from 'react-helmet'
import Banner from './Assets/Banner.png'


function App() {

  return (
    <>
      <Helmet>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Listify" />
        <meta property="og:image" content={Banner} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Logo do Listfy com um carrinho de compras e um check" />
        <meta property="og:title" content="Listfy - Listas de Supermercado Compartilhadas e Inteligentes" />
        <meta property="og:description" content="App de lista de compras compartilhado. Marque itens e some os preços em tempo real com quem mora com você." />
      </Helmet>

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
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  )
}

export default App
