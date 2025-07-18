import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Quotations', path: '/quotation' },
  { label: 'Sales Orders', path: '/sales-order' },
  { label: 'Customers', path: '/customers' },
  { label: 'Products', path: '/products' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
    path: string
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      window.location.href = path;
    }
  };

  return (
    <nav
      className="h-screen w-64 border-r bg-white flex flex-col p-4"
      tabIndex={0}
      aria-label="Sidebar"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Menu</h2>
      </div>
      <ul className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium cursor-pointer ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              tabIndex={0}
              aria-label={item.label}
              onKeyDown={(e) => handleKeyDown(e, item.path)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
