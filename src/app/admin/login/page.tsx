'use client'

import { useActionState } from 'react' // Use 'useFormState' if on older Next.js versions
import { authenticate } from '@/app/actions/auth' // Import the action we just created
import { User, Lock, Loader2, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function AdminLoginPage() {
  // Hook to handle form state and errors
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined)

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans bg-[#050505]">
      
      {/* BACKGROUND (Kept your design) */}
      <div className="absolute inset-0 z-0">
         <Image 
            src="/images/makkah-bg.jpg" 
            alt="Background" 
            fill 
            className="object-cover opacity-40" 
            priority
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
            <div className="text-[#F9C344] font-serif text-5xl font-bold border-4 border-[#F9C344] rounded-full w-24 h-24 flex items-center justify-center mb-4">
                UP
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wide">
                Umrah <span className="text-[#F9C344]">Plus</span>
            </h1>
            <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mt-2">Admin Dashboard</p>
        </div>

        {/* FORM */}
        <div className="bg-[#111] border border-[#F9C344]/20 rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#F9C344]"></div>

            <div className="p-8 pb-10">
                {}
                <form action={dispatch} className="space-y-6">
                    
                    {errorMessage && (
                        <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 text-sm rounded-xl text-center">
                            {errorMessage}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-4">Email</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <User size={20} />
                            </div>
                            <input 
                                name="email" 
                                type="email" 
                                required
                                placeholder="admin@umrahplus.com"
                                className="w-full bg-[#050505] border border-gray-800 rounded-xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-[#F9C344] transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase ml-4">Password</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <Lock size={20} />
                            </div>
                            <input 
                                name="password"
                                type="password" 
                                required
                                placeholder="••••••••"
                                className="w-full bg-[#050505] border border-gray-800 rounded-xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-[#F9C344] transition-all"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isPending}
                        className="w-full bg-[#F9C344] hover:bg-[#e0b03d] text-black font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {isPending ? <Loader2 className="animate-spin" size={20} /> : "LOGIN TO DASHBOARD"}
                    </button>

                </form>
            </div>
        </div>
        
        <div className="mt-8 text-center">
             <button className="text-gray-500 text-xs flex items-center justify-center gap-1 hover:text-[#F9C344] transition-colors mx-auto group">
                Back to Website <ArrowRight size={12} />
             </button>
        </div>

      </div>
    </div>
  )
}