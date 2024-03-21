import React from 'react';
import { Image } from 'react-native';

const NavbarIcons = ({source, size, color})=>(
    <Image source={source} style={{ width: size, height: size, tintColor:color}} />
);

export default NavbarIcons;