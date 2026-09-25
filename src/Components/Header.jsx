function Header({ title, subtitle, children }) {
  return (
    <header className="header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {children && <div className="header-actions">{children}</div>}
    </header>
  );
}

export default Header;
