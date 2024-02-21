import React from 'react';
import { Image } from 'react-native';

const NavbarIcons = ({source, size})=>(
    <Image source={source} style={{ width: size, height: size}} />
);

export default NavbarIcons;