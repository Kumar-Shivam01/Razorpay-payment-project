import React from 'react';
import Product from './components/Product';

function App() {
  return (
    <div className="app-container">
      {/* Top Navbar Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">💳</div>
          <span className="brand-title">Razorpay Payment Gateway</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <Product />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Razorpay Gateway Demo • React Frontend</p>
      </footer>
    </div>
  );
}

export default App;