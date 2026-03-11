import { Guitar, LogOut, User, GitCompare, Database, LayoutDashboard } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Header.module.css';

export const Header = () => {
  const { user, handleLogout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          <div className={styles.logo}>
            <Guitar size={20} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Gear DB</span>
            <span className={styles.brandSub}>Tone Database</span>
          </div>
        </NavLink>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            end
          >
            <LayoutDashboard size={15} />
            Dashboard
          </NavLink>
          <NavLink
            to="/database"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <Database size={15} />
            My Setups
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <GitCompare size={15} />
            Compare
          </NavLink>
        </nav>

        <div className={styles.user}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" />
              ) : (
                <User size={14} />
              )}
            </div>
            <span className={styles.userName}>
              {user?.displayName ?? user?.email?.split('@')[0] ?? 'User'}
            </span>
          </div>
          <button className={styles.logout} onClick={handleLogout} title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};
