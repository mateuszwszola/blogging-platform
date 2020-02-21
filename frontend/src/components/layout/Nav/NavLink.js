import React from 'react';
import { Link } from 'react-router-dom';

const NavLink = ({ children, ...props }) => <Link {...props}>{children}</Link>;

export default NavLink;
