// src/gatsby-theme-docz/components/Logo/index.js
import React from 'react';
import logo from '../../../../../img/warthog-logo.png';

// TODO: determine if we're in Dark mode and use a separate logo
export const Logo = () => <img src={logo} alt="Warthog" width={180} />;
