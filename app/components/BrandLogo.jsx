import React from 'react';
import { Dimensions } from 'react-native';
import Logo from '../../assets/images/logowname.svg';

const ASPECT_RATIO = 31 / 140;
const BASE_WIDTH = 140 * 4;
const screenWidth = Dimensions.get('window').width;

export default function BrandLogo({ style, maxWidthPercent = 0.45, preserveAspectRatio }) {
  const width = Math.min(BASE_WIDTH, screenWidth * maxWidthPercent);
  return (
    <Logo
      width={width}
      height={width * ASPECT_RATIO}
      style={style}
      preserveAspectRatio={preserveAspectRatio}
    />
  );
}
