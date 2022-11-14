import { useContext } from 'react'

import { AuthContext } from '../contexts/auth'



export const Navbar = () => {

    const { signOut, user } = useContext(AuthContext)

    console.log(">>> navbar user", user)

    return (
        <nav className="navbar navbar-dark bg-dark fixed-top" >
            <div className="container">
                <a className="navbar-brand" href="#">myhealth</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="offcanvas offcanvas-end text-bg-dark" tabIndex={-1} id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">myhealth menu</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" />
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            {
                                user
                                    ? <li className="nav-item">
                                        <a className="nav-link" aria-current="page" >bem vindo, {user.nome}</a>
                                    </li>
                                    : <></>
                            }
                            <li className="nav-item">
                                <a className="nav-link" aria-current="page" href="/" >home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/dailyMeasurements">medição diária</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/weights">peso</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/sleepNights">sono</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/foods">alimentação</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/medicines">medicamentos</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/PhysicalActivities">atividade física</a>
                            </li>
                            {
                                user ? <li className="nav-item">
                                    <a className="nav-link" href="/profile">perfil de {user.nome}</a>
                                </li>
                                    : <></>
                            }
                            {
                                user ? <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={signOut}>sair</button>
                                </li>
                                    : <></>
                            }


                            {
                                user ? <></>
                                    : <li className="nav-item">
                                        <a className="nav-link" href="/">entrar</a>
                                    </li>
                            }

                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}