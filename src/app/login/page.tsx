'use client'
import { login, register } from './actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthActionResult {
    success?: boolean;
    error?: string;
}

const LoginPage = () => {
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState('')

    const toggleRegister = () => {
        console.log('Toggling register state:', !isRegistering) // Debug log
        setIsRegistering(!isRegistering)
        setError('')
    }

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <div className="nes-container is-dark with-title h-120 w-9/12 !border-2 !border-[#209cee]">
                <h1 className="title">
                    {isRegistering ? 'Register for HypeHub' : 'Login to HypeHub'}
                </h1>
                {error && 
                    <span className='nes-text is-error'>
                       !!{error}!!
                    </span>
                }
                
                    {isRegistering ? (
                        <>
                            <RegisterForm handleRegister={register} setError={setError} />
                                <button 
                                    type="button"
                                    className='nes-btn is-warning' 
                                    onClick={toggleRegister}
                                >
                                    Already have an account? Login
                                </button>
                        </>
                    ) : (
                        <>
                            <LoginForm handleSubmit={login} setError={setError} />
                                <button 
                                    type="button"
                                    className='nes-btn is-warning' 
                                    onClick={toggleRegister}
                                >
                                    Don&apos;t have an account? Register
                                </button>
                        </>
                    )}
           
            </div>
        </div>
    )
}

const LoginForm = ({ 
    handleSubmit, 
    setError 
}: { 
    handleSubmit: (formData: FormData) => Promise<AuthActionResult>,
    setError: (error: string) => void
}) => {
    const router = useRouter(); // Add this line to get router in this component
    
    return (
        <form 
            action={async (formData: FormData) => {
                const result = await handleSubmit(formData)
                if (result?.error) {
                    setError(result.error)
                } else {
                    router.push('/')
                }
            }}
            className='p-4 flex flex-col justify-center items-center gap-4 mx-auto w-8/12 h-full'
        >
            <div className='nes-field is-inline mb-4'>
                <label className='whitespace-nowrap' htmlFor="email">Email</label>
                <input 
                    className='nes-input is-dark is-rounded' 
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder='you@example.com' 
                    required
                />
            </div>
            <div className='nes-field is-inline mb-4'>
                <label className='whitespace-nowrap' htmlFor="password">Password</label>
                <input 
                    className='nes-input is-dark is-rounded' 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder='********' 
                    required
                />
            </div>
            <button 
                type="submit"
                className='nes-btn is-primary'
            >
                Login
            </button>
        </form>
    )
}

const RegisterForm = ({ 
    handleRegister,
    setError

}: { 
    handleRegister: (formData: FormData) => Promise<AuthActionResult>,
    setError: (error: string) => void
}) => {
    const router = useRouter(); // Add this line to get router in this component

    return (
        <form 
            action={async (formData: FormData) => {
                const result = await handleRegister(formData)
                if (result?.error) {
                    setError(result.error)
                }else {
                    router.push('/')
                }
            }}
            className='p-4 flex flex-col justify-center items-center gap-4 w-9/12 max-w-3xl mx-auto'
        >
            <div className='nes-field flex is-inline mb-4'>
                <label className='whitespace-nowrap' htmlFor="email">First Name</label>
                <input 
                    className='nes-input is-dark is-rounded' 
                    type="text" 
                    name="firstName" 
                    id="firstName" 
                    placeholder='John' 
                    required
                />
            </div>
            <div className='nes-field is-inline mb-4'>
                <label className='whitespace-nowrap' htmlFor="email">Last Name</label>
                <input 
                    className='nes-input is-dark is-rounded' 
                    type="text" 
                    name="lastName" 
                    id="lastName" 
                    placeholder='Doe' 
                    required
                />
            </div>
            <div className='nes-field is-inline mb-4'>
                <label className='whitespace-nowrap' htmlFor="email">Email</label>
                <input 
                    className='nes-input is-dark is-rounded' 
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder='you@example.com' 
                    required
                />
            </div>
            <div className='nes-field is-inline mb-4'>
                <label className='whitespace-nowrap' htmlFor="password">Password</label>
                <input 
                    className='nes-input is-dark is-rounded' 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder='********' 
                    required
                />
            </div>
            <button 
                type="submit"
                className='nes-btn is-success'
            >
                Register
            </button>
        </form>
    )
}

export default LoginPage
