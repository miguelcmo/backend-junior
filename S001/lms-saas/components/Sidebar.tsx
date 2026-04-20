export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">LMS</h2>

      <nav className="space-y-2">
        <a href="/dashboard">Dashboard</a>
        <a href="/courses">Cursos</a>
      </nav>
    </aside>
  );
}