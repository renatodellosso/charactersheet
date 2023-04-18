import Image from 'next/image'
import { Inter } from 'next/font/google'
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next';
import Nextauth from './api/auth/[...nextauth]';
import { AppProps } from 'next/app';
import { Character, cleanCharacters, getCharacters } from '@/lib/db/characters';
import { ObjectId } from 'mongodb';
import { emailToID } from '@/lib/db/users';
import { characters } from '../lib/db/db';
import Router from 'next/router';

const inter = Inter({ subsets: ['latin'] })

interface IndexProps {
  status: string,
  session: {
    user: {
      name: string,
      email: string
    }
  },
  characters: Character[]
}

async function newCharacter() {
  console.log("Creating new character...");

  try {
    const res = await fetch('/api/character/new');
    const data = await res.json();

    console.log(data);

  } catch(err) {
    console.log(err);
  }
}

async function goToSheet(id: string) {
  console.log("Going to sheet... Id: " + id);
  Router.push( { pathname: `/protected/sheet`, query: {
    id: id
  }});
}

export default function Home(props: IndexProps) {
  const { status } = useSession();

  if(status === "authenticated")
    return (
      <main className="flex min-h-screen flex-col items-left p-24">
        <div className="flex flex-row mb-8">
          <h2 className='pr-3 pt-1'>Signed in as <strong>{props.session.user?.name}</strong></h2>
          <button className='pl-1 pr-1 text-xl' onClick={() => signOut()}>Sign Out</button>
        </div>

        <h1>Characters</h1>
        <div>
          { props.characters.map((character) => 
            <button key={character.idString} onClick={() => goToSheet(character.idString)} className='m-2 p-1'>
              {character.name}
            </button>)}
        </div>
        <button onClick={() => newCharacter()} className='ml-2 mr-2'><strong>Create new character</strong></button>
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
        <button onClick={() => signIn()} className="pl-2 pr-2">
          <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
            Sign in/Create Account{' '}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const userID = await emailToID(session?.user?.email!);

  if(userID) {
    const characters: Character[] = cleanCharacters(await getCharacters(userID!));

    return {
      props: {
        session: session,
        characters: characters
      }
    }
  } else {
    return {
      props: {
        session: session
      }
    }
  }
}