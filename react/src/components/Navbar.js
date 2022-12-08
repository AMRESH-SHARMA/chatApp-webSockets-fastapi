import React from 'react'
import './Navbar.css'

const navbar = () => {
  return (<>
    <nav>
      <div class="logo">MR CODER</div>
      <input type="checkbox" id="checkbox" />
        <label for="checkbox" id="icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
        <ul>
          <li><a href="/" class="active">Home</a></li>
          <li><a href="/">Buy</a></li>
          <li><a href="/">Sell</a></li>
          <li><a href="/">My Auctions</a></li>
          <li><a href="/">About</a></li>
        </ul>
    </nav>
  </>
  )
}

export default navbar