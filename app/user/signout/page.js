'use client'

import { signOut } from "firebase/auth";
import { auth } from "@/app/_lib/firebase";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Błąd podczas wylogowywania:", error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <h1>Wylogowanie</h1>
            <p>Czy na pewno chcesz się wylogować?</p>

            <form onSubmit={onSubmit}>
                <button
                    type="submit"
                    style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        marginRight: '10px'
                    }}
                >
                    Wyloguj
                </button>

                <button
                    type="button"
                    onClick={() => router.back()}
                    style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Anuluj
                </button>
            </form>
        </div>
    );
}