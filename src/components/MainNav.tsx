import Link from "next/link"
import { useSession, signIn , signOut } from "next-auth/react"


export function MainNav() {
    const session = useSession()
    const user = session.data?.user
    return <nav className="sticky top-0 z-10  px-2 py-4 ">
          {/* <p className="text-sm ">Logged in as {user?.name}</p> */}
        <ul className="flex items-center gap-3 whitespace-nowrap">
            <li>
                <Link href="/">Dashboard</Link>
            </li>
            <li>
                <Link href="/products">Products</Link>
            </li>
            <li>
                <Link href="/orders">Products</Link>
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