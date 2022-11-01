import { NavLink } from "react-router-dom";
import Style from "./GlobalNavStyle.module.css";

const GlobalNav = () => {
  const navLinks = [
    {
      id: 1,
      to: "/",
      value: "Dashboard",
      dataid: "dashboardbtn"
      

    },
    {
      id: 2,
      to: "/add",
      value: "Add Post",
      dataid: "addPostbtn"
      
    },
  ];
  return (
    <nav className={Style.container}>
      {navLinks.map((link) => {
        return (
          <NavLink
            key={link.id}
            to={link.to}
            end
            data-testid={link.dataid} 
            className={({ isActive }) => (isActive ? Style.active : undefined)}
          >
            {link.value}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default GlobalNav;
