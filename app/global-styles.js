import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: Arial, sans-serif;
  }

  #app {
    height: 100%;
    width: 100%;
  }
  
  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
  
  ul {
    padding-left: 10px;
  }
  
  svg {
    overflow: visible !important;
  }
`;
