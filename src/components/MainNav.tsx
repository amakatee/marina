import Link from "next/link"
import { useSession, signIn , signOut } from "next-auth/react"


export function MainNav() {
    const session = useSession()
    const user = session.data?.user
    return <nav className="sticky top-0 z-10 flex px-2 py-4">
        <ul className="flex items-center gap-2 whitespace-nowrap">
            <li>
                <Link href="/">Home</Link>
            </li>
            <li>
                <Link href="/products">Shop</Link>
            </li>
            {user == null ? (
                <li>
                    <button onClick={() => void signIn()}>
                        Log In
                    </button>
               </li>
            ) : (
                <li>
                    <button onClick={() => void signOut()}>
                        Log Out 
                    </button>
               </li>
            ) }

        </ul>
    </nav>
}