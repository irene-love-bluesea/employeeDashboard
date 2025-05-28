import React from 'react';
import logo from './assets/vanness.png'; // Adjust the path to your logo

const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="Logo" className="logo" />
    </header>
  );
};

export default Header;
