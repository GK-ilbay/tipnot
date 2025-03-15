import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Roboto', 'Helvetica Neue', sans-serif;
    background-color: #f8f9fa;
    color: #2c3e50;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.3;
  }

  a {
    text-decoration: none;
    color: #3498db;
    transition: color 0.3s ease;
  }

  a:hover {
    color: #2980b9;
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: 1rem;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .page-transition {
    animation: fadeIn 0.5s ease;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;

export default GlobalStyles; 