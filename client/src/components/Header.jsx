import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import DarkModeToggle from './DarkModeToggle.jsx';

const navClass = ({ isActive }) =>
  `tap-target inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
    isActive ? 'bg-brand-100 text-brand-700' : 'text-body hover:bg-surface-soft'
  }`;

const mobileNavClass = ({ isActive }) =>
  `tap-target block w-full rounded-md px-3 py-3 text-sm font-semibold ${
    isActive ? 'bg-brand-100 text-brand-700' : 'text-body hover:bg-surface-soft'
  }`;

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinks = (
    <>
      <NavLink to="/" className={navClass} onClick={closeMenu}>
        首页
      </NavLink>
      <NavLink to="/products" className={navClass} onClick={closeMenu}>
        全部商品
      </NavLink>
      <NavLink to="/cart" className={navClass} onClick={closeMenu}>
        购物车 ({count})
      </NavLink>
      {user && (
        <>
          <NavLink to="/orders" className={navClass} onClick={closeMenu}>
            我的订单
          </NavLink>
          <NavLink to="/profile" className={navClass} onClick={closeMenu}>
            个人中心
          </NavLink>
        </>
      )}
      {user?.isAdmin && (
        <>
          <NavLink to="/admin" className={navClass} onClick={closeMenu}>
            管理看板
          </NavLink>
          <NavLink to="/admin/products" className={navClass} onClick={closeMenu}>
            商品管理
          </NavLink>
          <NavLink to="/admin/orders" className={navClass} onClick={closeMenu}>
            订单管理
          </NavLink>
        </>
      )}
    </>
  );

  const mobileNavLinks = (
    <>
      <NavLink to="/" className={mobileNavClass} onClick={closeMenu}>
        首页
      </NavLink>
      <NavLink to="/products" className={mobileNavClass} onClick={closeMenu}>
        全部商品
      </NavLink>
      <NavLink to="/cart" className={mobileNavClass} onClick={closeMenu}>
        购物车 ({count})
      </NavLink>
      {user && (
        <>
          <NavLink to="/orders" className={mobileNavClass} onClick={closeMenu}>
            我的订单
          </NavLink>
          <NavLink to="/profile" className={mobileNavClass} onClick={closeMenu}>
            个人中心
          </NavLink>
        </>
      )}
      {user?.isAdmin && (
        <>
          <NavLink to="/admin" className={mobileNavClass} onClick={closeMenu}>
            管理看板
          </NavLink>
          <NavLink to="/admin/products" className={mobileNavClass} onClick={closeMenu}>
            商品管理
          </NavLink>
          <NavLink to="/admin/orders" className={mobileNavClass} onClick={closeMenu}>
            订单管理
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-theme bg-surface-raised/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-black text-heading" onClick={closeMenu}>
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-sm text-white">
              悦
            </span>
            <span>悦购商城</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden flex-wrap items-center gap-2 md:flex">
            {navLinks}
          </nav>

          {/* Desktop user actions */}
          <div className="hidden items-center gap-2 md:flex">
            <DarkModeToggle />
            {user ? (
              <>
                <span className="text-sm font-medium text-body">{user.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="tap-target rounded-md border border-theme px-3 py-2 text-sm font-semibold text-body hover:bg-surface-soft"
                >
                  退出
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="tap-target inline-flex items-center rounded-md border border-theme px-3 py-2 text-sm font-semibold text-body hover:bg-surface-soft"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="tap-target inline-flex items-center rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  注册
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger + toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <DarkModeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="tap-target flex items-center rounded-md border border-theme px-3 py-2 text-body hover:bg-surface-soft"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
            >
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="mt-3 border-t border-theme pt-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {mobileNavLinks}
            </nav>
            <div className="mt-3 border-t border-theme pt-3">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-body">{user.name}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="tap-target rounded-md border border-theme px-3 py-2 text-sm font-semibold text-body hover:bg-surface-soft"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="tap-target flex-1 rounded-md border border-theme px-3 py-2 text-center text-sm font-semibold text-body hover:bg-surface-soft"
                  >
                    登录
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="tap-target flex-1 rounded-md bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    注册
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
