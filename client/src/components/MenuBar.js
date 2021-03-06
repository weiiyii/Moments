import React, { useContext, useState } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
// THIS IS A CLASS BASED COMPONENT:
// export default class MenuExampleSecondaryPointing extends Component {

// WE WANT A FUNCTIONAL COMPONENTS:
function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  // make the color on within the corresponding page
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  // dont need render since this is a functional component, we just return
  //   render() {
  //     const { activeItem } = this.state

  const menuBar = user ? (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name={user.username}
        active
        // cool about component from semantic ui react:
        // it is an integration, we can have it as a different component
        as={Link}
        // prop that will be on the link:
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        // cool about component from semantic ui react:
        // it is an integration, we can have it as a different component
        as={Link}
        // prop that will be on the link:
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
}

export default MenuBar;
