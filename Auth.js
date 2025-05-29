import React, { useContext, useState } from 'react'
import { Container, Form, Card, Button } from 'react-bootstrap'
import { login, registration } from '../http/userAPI'
import { observer } from 'mobx-react-lite'
import { Context } from '..'
import { WidgetContext } from '../components/WidgetManager'

function validateEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
}

const MIN_PASSWORD_LENGTH = 6;

const Auth = observer(({ isLogin: isLoginProp }) => {
    const {user} = useContext(Context)
    const { showWidget } = useContext(WidgetContext)
    const [isLogin, setIsLogin] = useState(isLoginProp !== undefined ? isLoginProp : true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [validationError, setValidationError] = useState('')
    const [loading, setLoading] = useState(false)
    const [wasSubmitted, setWasSubmitted] = useState(false)

    const validateEmailField = (email) => {
        if (!email) {
            return 'Email не может быть пустым';
        }
        if (!validateEmail(email)) {
            return 'Введите корректный email (например, user@mail.com)';
        }
        return '';
    }

    const validatePasswordField = (password) => {
        if (!password) {
            return 'Пароль не может быть пустым';
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            return `Пароль должен быть не менее ${MIN_PASSWORD_LENGTH} символов`;
        }
        if (!/[0-9]/.test(password)) {
            return 'Пароль должен содержать хотя бы одну цифру';
        }
        return '';
    }

    // Подсказки только после попытки отправки
    const emailError = wasSubmitted ? validateEmailField(email) : '';
    const passwordError = wasSubmitted ? validatePasswordField(password) : '';

    const validate = () => {
        const emailValidation = validateEmailField(email);
        if (emailValidation) return emailValidation;
        
        const passwordValidation = validatePasswordField(password);
        if (passwordValidation) return passwordValidation;
        
        return '';
    }

    const getErrorMessage = (error) => {
        if (error.response) {
            // Ошибка от сервера
            switch (error.response.status) {
                case 400:
                    return 'Неверный формат данных';
                case 401:
                    return 'Неверный email или пароль';
                case 403:
                    return 'Доступ запрещен';
                case 404:
                    return 'Сервер не найден';
                case 409:
                    return 'Пользователь с таким email уже существует';
                case 500:
                    return 'Ошибка сервера. Попробуйте позже';
                default:
                    if (error.response.data?.message) {
                        if (error.response.data.message.includes('password')) {
                            return 'Неверный пароль';
                        }
                        return error.response.data.message;
                    }
                    return 'Произошла ошибка';
            }
        } else if (error.request) {
            // Ошибка сети
            return 'Ошибка сети. Проверьте подключение к интернету';
        } else {
            // Другие ошибки
            return error.message || 'Произошла неизвестная ошибка';
        }
    }

    const click = async () => {
        setWasSubmitted(true);
        const valError = validate();
        setValidationError(valError);
        if (valError) return;
        setLoading(true);
        try {
            setError('')
            let data
            if (isLogin) {
                data = await login(email, password)
            } else {
                data = await registration(email, password)
            }
            user.setUser(data)
            user.setIsAuth(true)
            showWidget('home')
        } catch (e) {
            setError(getErrorMessage(e))
        } finally {
            setLoading(false);
        }
    }

    const onEmailChange = e => {
        setEmail(e.target.value);
        setValidationError('');
        setError('');
    }

    const onPasswordChange = e => {
        setPassword(e.target.value);
        setValidationError('');
        setError('');
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                <Form className="d-flex flex-column" onSubmit={e => {e.preventDefault(); click();}}>
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш email..."
                        value={email}
                        onChange={onEmailChange}
                        isInvalid={!!emailError}
                    />
                    {emailError && <div className="text-danger" style={{fontSize: '0.9em'}}>{emailError}</div>}
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={onPasswordChange}
                        type="password"
                        isInvalid={!!passwordError}
                    />
                    {passwordError && <div className="text-danger" style={{fontSize: '0.9em'}}>{passwordError}</div>}
                    {(validationError || error) && <div className="text-danger mt-2">{validationError || error}</div>}
                    <div className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ?
                            <div>
                                Нет аккаунта?{' '}
                                <Button variant="link" onClick={() => {setIsLogin(false); setError(''); setValidationError(''); setWasSubmitted(false);}} style={{padding: 0}}>Зарегистрируйся!</Button>
                            </div>
                            :
                            <div>
                                Есть аккаунт?{' '}
                                <Button variant="link" onClick={() => {setIsLogin(true); setError(''); setValidationError(''); setWasSubmitted(false);}} style={{padding: 0}}>Войдите!</Button>
                            </div>
                        }
                        <Button
                            variant={"outline-success"}
                            onClick={click}
                            disabled={loading}
                        >
                            {loading ? 'Проверка...' : (isLogin ? 'Войти' : 'Регистрация')}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    )
})

export default Auth
