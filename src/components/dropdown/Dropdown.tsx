import { useState, useEffect, useRef, FC, ReactNode } from 'react';
import styles from './dropdown.module.css';

interface MenuItem {
  label: string;
  href: string;
}

interface DropdownProps {
  menuItems: MenuItem[];
  children: ReactNode;
}

const Dropdown: FC<DropdownProps> = ({ menuItems, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button onClick={toggleDropdown} className={styles.dropdownButton}>
        {children}
      </button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          {menuItems.map((item, index) => (
            <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" onClick={toggleDropdown}>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
