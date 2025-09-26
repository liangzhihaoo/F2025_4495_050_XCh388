import React, { useState } from 'react'
import TopBar from '../../components/TopBar/TopBar'
import { assets } from '../../assets/assets'
import supabase from '../../helper/SupabaseClient'
import { toast } from 'react-hot-toast'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        setLoading(false)

        if (!error) {
            toast.error(error.message || 'Login failed. Please try again.')
        } else {
            toast.success('Login successful!')
            window.location.href = '/wallet'
        }
    }

    return (
        <div className='min-h-screen bg-[#101014] flex flex-col'>
            <img
                src={assets.gradient_background_4}
                alt=""
                className="pointer-events-none select-none absolute bottom-0 left-0 w-full z-0"
                style={{ objectFit: 'cover' }}
                draggable={false}
            />

            <div className="relative z-10 flex-grow flex flex-col">
                <TopBar />

                <div className="flex-grow flex flex-col justify-center items-center px-4">
                    <div className="w-full flex justify-center items-center">
                        <form
                            className="bg-[#17161D] border border-[#5E38BD] rounded-[30px] p-8 md:p-12 max-w-lg w-full mx-auto"
                            onSubmit={handleLogin}
                        >
                            <h2 className="text-white text-2xl font-semibold text-center mb-6">Login</h2>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-[#232336] text-white placeholder-gray-400 focus:outline-none"
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-[#232336] text-white placeholder-gray-400 focus:outline-none"
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-[#A25EFF] via-[#5E38BD] to-[#5E38BD] text-white font-normal rounded-lg px-8 py-3 shadow-md hover:opacity-90 transition cursor-pointer disabled:opacity-60"
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>

                                <div className="my-4 text-center text-white/70 text-sm">or register with</div>
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#232336] text-white font-medium hover:bg-[#232336]/80 transition cursor-pointer">
                                    <img src={assets.google_logo} alt="Google logo" />
                                    Google
                                </button>

                                <div className="mt-4 text-center text-white/60 text-sm">
                                    Don't have an account yet? <a href="/onboarding-step1" className="underline">Sign Up</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login