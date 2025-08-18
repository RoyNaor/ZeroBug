'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  User as HeroUser,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
} from '@heroui/react';
import { AiFillBug } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';

export default function AppNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { data: session, status } = useSession();

  const HIDE_NAVBAR_ON = ['/signin', '/signup'];
  if (HIDE_NAVBAR_ON.includes(pathname)) return <></>; 

  const links = [
    { label: 'Dashboard', href: '/' },
    { label: 'Issues', href: '/issues' },
  ];

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Navbar
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white/80 backdrop-blur border-b border-gray-200 text-gray-800"
    >
      {/* Left: burger + brand */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
        <NavbarBrand>
          <AiFillBug className="text-blue-600 mr-2 text-2xl" />
          <p className="font-bold text-gray-900 tracking-tight">ZeroBug</p>
        </NavbarBrand>
      </NavbarContent>

      {/* Center links (desktop) */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {links.map(({ label, href }) => {
          const active = isActive(href);
          return (
            <NavbarItem key={href} isActive={active}>
              <Link
                as={NextLink}
                href={href}
                aria-current={active ? 'page' : undefined}
                color={active ? 'primary' : 'foreground'}
                className={
                  active
                    ? 'text-blue-700 font-medium'
                    : 'text-gray-600 hover:text-gray-900 transition-colors'
                }
              >
                {label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* Right: user menu (desktop) */}
      <NavbarContent justify="end">
        {status === 'loading' && (
          <NavbarItem>
            <Skeleton className="rounded-full h-10 w-10" />
          </NavbarItem>
        )}

        {status === 'authenticated' && session?.user ? (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <button className="outline-none">
                  <HeroUser
                    name={session.user.name ?? session.user.email ?? 'User'}
                    description={session.user.email ?? undefined}
                    className="transition-transform"
                    avatarProps={{
                      src: session.user.image ?? undefined,
                      radius: 'full',
                      fallback: <FiUser className="text-gray-500" />,
                    }}
                  />
                </button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User menu"
                onAction={(key) => {
                  if (key === 'logout') {
                    signOut({ callbackUrl: '/signin' });
                  }
                }}
              >
                <DropdownItem key="logout" color="danger">
                  Log out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <NavbarItem className="hidden sm:flex">
            <Button as={NextLink} href="/signin" variant="flat">
              Sign in
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu>
        {links.map(({ label, href }) => (
          <NavbarMenuItem key={href} isActive={isActive(href)}>
            <Link
              as={NextLink}
              href={href}
              size="lg"
              className={isActive(href) ? 'text-blue-700 font-medium' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </Link>
          </NavbarMenuItem>
        ))}

      </NavbarMenu>
    </Navbar>
  );
}
