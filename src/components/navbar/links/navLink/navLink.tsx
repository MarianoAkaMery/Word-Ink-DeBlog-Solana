import Link from "next/link";
import styles from "./navLink.module.css";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  item: {
    path: string;
    title: string;
    icon: JSX.Element;
  };
}

const NavLink: React.FC<NavLinkProps> = ({ item }) => {
  const pathName = usePathname();

  return (
    <Link
      href={item.path}
      className={`${styles.container} ${
        pathName === item.path && styles.active
      }`}
    >
      <span className={styles.text}>{item.title} </span>
      <span className={styles.icon}>{item.icon} </span>
    </Link>
  );
};

export default NavLink;
