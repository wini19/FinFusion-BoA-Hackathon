import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <h1>APIGLOW</h1>
      <div className="filters">
        <select aria-label="Domain filter">
          <option>Domain</option>
          <option>C&I</option>
          <option>FRAL</option>
        </select>
        <select aria-label="Project filter">
          <option>Project</option>
          <option>SBP</option>
          <option>Cora</option>
        </select>
        <select aria-label="Environment filter">
          <option>Environment</option>
          <option>Prod</option>
          <option>Dev</option>
        </select>
        <select aria-label="Time range filter">
          <option>Time Range</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>
      <input type="search" placeholder="Search..." aria-label="Search" />
    </header>
  );
};

export default Header;