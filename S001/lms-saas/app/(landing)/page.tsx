import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">
        Plataforma LMS SaaS
      </h1>

      <p className="mb-6 text-gray-600">
        Crea, gestiona y enseña cursos fácilmente
      </p>

      <Link
        href="/dashboard"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Ir al Dashboard
      </Link>
    </div>
  );
}