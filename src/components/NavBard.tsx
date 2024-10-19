"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation'
function handleLogout() {

    localStorage.removeItem("userData");
}

const NavBard = () => {

    const localStorageData = localStorage.getItem("userData");
    const userData = JSON.parse(localStorageData!);
    console.log(userData)

    return (
        <>
            <nav className="p-4 md:p-6 bg-gray-900 text-white shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <a href="/" className="text-2xl font-bold hover:text-gray-300 transition-colors">
                        Chai shayari
                    </a>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm md:text-lg font-medium">
                            Welcome, {userData?.data?.data?.username || 'Guest'}
                        </span>
                     
                        {
                          userData?(<>
                          <Link href='/'>
                          <Button
                            onClick={handleLogout}
                            className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                            variant='outline'
                        >
                            Logout
                        </Button>
                          </Link>
                           </>):(<>
                        <Link href="/sign-in">
                        <Button
                            onClick={handleLogout}
                            className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                            variant='outline'
                        >
                            Login

                        </Button>
                        </Link>
                          
                          </>)
                        }
                      
                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavBard;
