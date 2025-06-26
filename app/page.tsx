// import  Link  from "next/link";

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center p-24">
//       <h1 className="text-4xl font-bold">Homepage do Site</h1>
//       <hr />
//       <nav className="mt-6">
//         <Link className="text-blue-500" href="/login">Acesse o Portal</Link> ou{' '}
//         <Link className="text-blue-500" href="/signup">Crie uma conta</Link>
//       </nav>
//     </main>
//   );
// }


import Link from "next/link";

export default function Home() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center p-8 text-white overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/dollar_symbol.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-70 z-0" />

      <div className="bg-black/0 p-10 rounded-2xl shadow-lg text-center max-w-md w-full z-10">
        <h1 className="text-5xl font-extrabold text-green-600 mb-6">
          Bem-vindo ao Fatecash
        </h1>
        <p className="text-lg mb-8">
          Sua plataforma de finanças inteligente.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-all duration-300"
          >
            Acesse o Portal
          </Link>
          <Link
            href="/signup"
            className="border border-green-600 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl text-center transition-all duration-300"
          >
            Crie uma Conta
          </Link>
        </div>
      </div>
    </main>
  );
}


