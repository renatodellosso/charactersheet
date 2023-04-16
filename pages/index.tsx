import Image from 'next/image'
import { Inter } from 'next/font/google'
import { signIn, signOut, useSession } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {data: session, status } = useSession();

  if(status === "authenticated")
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <button onClick={() => signOut()}>Sign Out</button>
      </main>
    );

  if(status === "loading")
      return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <p>Loading...</p>
        </main>
      )

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-4xl"><strong>Character Sheet</strong></h1>
      </div>

      <div className="mb-24 pb-16 flex items-center justify-center w-screen text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <button onClick={() => signIn("google")}>
          <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
            Sign in with Google{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`${inter.className} m-0 max-w-[30ch] text-sm opacity-50`}>
            Create an account or sign in to continue.
          </p>
        </button>
      </div>

    </main>
  )
}
