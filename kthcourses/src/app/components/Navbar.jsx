import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="min-w-80 h-[56px] fixed top-0 z-50 w-screen bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">

        <h1> <Link href="/" className="font-bold text-kth-blue md:text-xl">
              KTH Courses
        </Link> </h1>
        {false && ( // TODO: remove this after redesigning the navbar
          <ul className="flex space-x-6">
          <li>
            <Link href="/" className="text-gray-700 hover:text-black">
              Search
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-gray-700 hover:text-black">
              About
            </Link>
          </li>
        </ul>
        )}
      </div>
    </nav>
  );
}
