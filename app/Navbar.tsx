'use client';

import React from 'react';
import NextLink from 'next/link';
import {usePathname} from 'next/navigation';
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
} from '@heroui/react';
import {AiFillBug} from 'react-icons/ai';

export default function AppNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const links = [
    { label: 'Dashboard', href: '/' },
    { label: 'Issues', href: '/issues' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Navbar
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white/80 backdrop-blur border-b border-gray-200 text-gray-800"
    >
      {/* Left side: hamburger + brand */}
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

      {/* Center links (desktop only) */}
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

      {/* Right side buttons */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link as={NextLink} href="/login" className="text-gray-700 hover:text-gray-900">
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={NextLink} href="/signup" color="primary" variant="flat" className="text-gray-900">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu content */}
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
        <NavbarMenuItem>
          <Link as={NextLink} href="/login" size="lg" onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            as={NextLink}
            href="/signup"
            color="primary"
            variant="flat"
            className="w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign Up
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
