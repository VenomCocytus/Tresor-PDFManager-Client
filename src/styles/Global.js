import { createGlobalStyle } from "styled-components";

export const Global = createGlobalStyle`  
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', 'Poppins', sans-serif;
  }

  @font-face {
    font-family: 'Poppins';
    src: url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
  }

  html,
  body,
  #root,
  .app,
  .content {
    height: 100%;
    width: 100%;
    font-family: "Roboto", sans-serif;
  }

  .app {
    display: flex;
    position: relative;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #e0e0e0;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

`;

export default Global;
