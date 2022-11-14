import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'
import './signin.css'



export default function SignIn() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signIn, loadingAuth} = useContext(AuthContext)


    
    function handleSubmit(e){
        e.preventDefault()
        
        if(email !== '' && password !== ''){
          signIn(email, password)
        }
      }




    return (
        <div className="container-fluid ps-md-0">
            <div className="row g-0">
                <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image" />
                <div className="col-md-8 col-lg-6">
                    <div className="login d-flex align-items-center py-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-9 col-lg-8 mx-auto">
                                    <h3 className="login-heading mb-4">bem vindo de volta!</h3>                                    

                                    <form onSubmit={handleSubmit}>
                                        <div className="form-floating mb-3">
                                            <input type="email" className="form-control" id="email" placeholder="email, exemplo: name@example.com" value={email} onChange={ (e) => setEmail(e.target.value) }/>
                                            <label htmlFor="email">email</label>
                                            <small id="error_message_email" className='text-danger' style={{ display: 'none' }}>*** é necessário informar o [email]! ***</small>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input type="password" className="form-control" id="password" placeholder="senha" value={password} onChange={(e) => setPassword(e.target.value) } />
                                            <label htmlFor="password">senha</label>
                                            <small id="error_message_password" className='text-danger' style={{ display: 'none' }}>*** é necessário informar a [senha]! ***</small>
                                        </div>
                                        <div className="d-grid">
                                            <button className="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2" type="submit" id="submitformbutton" >{loadingAuth ? 'Carregando...' : 'Acessar'}</button>
                                            <div className="text-center">
                                           
                                                <Link to="/register">quer se cadastrar?</Link>
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}