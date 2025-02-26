import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-screen bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Course Explorer</h1>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="text-gray-700 hover:text-black">
              Home
            </Link>
          </li>
          <li>
            <Link href="/courses" className="text-gray-700 hover:text-black">
              Courses
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-gray-700 hover:text-black">
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
