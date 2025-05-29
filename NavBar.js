import React from "react";
import { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Context } from "../index";
import { Button, Container } from "react-bootstrap"
import { observer } from "mobx-react-lite";
import { WidgetContext } from "./WidgetManager";

export const NavBar = observer (({ loading }) => {
    const {user, place} = useContext(Context)
    const { showWidget } = useContext(WidgetContext)

    if (loading) return null;

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.removeItem('token')
        showWidget('home')
    }

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
            <Button 
                variant="link" 
                style={{color:'white', textDecoration: 'none'}} 
                onClick={() => {
                    place.setSelectedType({})
                    place.setPage(1)
                    showWidget('home')
                }}
            >Главная</Button>
            <Nav className="ms-auto" style={{color:'white'}}>
                {user.isAuth && user.user && user.user.role === 'ADMIN' && (
                    <Button 
                        variant="outline-light" 
                        onClick={() => showWidget('admin')}
                        className="me-2"
                    >Админ панель
                    </Button>
                )}
                {user.isAuth ? (
                    <Button 
                        variant="outline-light" 
                        onClick={() => logOut()} 
                    >Выйти
                    </Button>
                ) : (
                    <Button variant="outline-light" onClick={() => showWidget('auth')}>Авторизация</Button>
                )}
            </Nav>
            </Container>
        </Navbar>
    )
})

export default NavBar;
