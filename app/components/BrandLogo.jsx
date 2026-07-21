import React from 'react';
import { Dimensions } from 'react-native';
import Logo from '../../assets/images/logowname.svg';

const ASPECT_RATIO = 31 / 140;
const BASE_WIDTH = 140 * 4;
const screenWidth = Dimensions.get('window').width;
const MAX_WIDTH = Math.min(BASE_WIDTH, screenWidth * 0.45);

export default function BrandLogo({ style }) {
  return <Logo width={MAX_WIDTH} height={MAX_WIDTH * ASPECT_RATIO} style={style} />;
}
