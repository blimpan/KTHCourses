import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="min-w-80 fixed top-0 z-50 w-screen bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-bold">KTH Courses</h1>
        <ul className="flex space-x-6">
          <li>
            <Link href="/courses" className="text-gray-700 hover:text-black">
              Search
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
