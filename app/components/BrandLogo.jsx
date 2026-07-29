import React from 'react';
import { Dimensions } from 'react-native';
import Logo from '../../assets/images/logowname.svg';

// The source svg's viewBox (0 0 648 360) has a lot of empty canvas around the
// mark; cropping to its actual bounding box means the rendered width/height
// map onto real ink instead of mostly padding.
const LOGO_VIEWBOX = '15 100 610 160';
const ASPECT_RATIO = 160 / 610;
const BASE_WIDTH = 140 * 4;
const screenWidth = Dimensions.get('window').width;

export default function BrandLogo({ style, maxWidthPercent = 0.45, maxWidth, preserveAspectRatio }) {
  const percentWidth = Math.min(BASE_WIDTH, screenWidth * maxWidthPercent);
  const width = maxWidth != null ? Math.min(percentWidth, maxWidth) : percentWidth;
  return (
    <Logo
      width={width}
      height={width * ASPECT_RATIO}
      viewBox={LOGO_VIEWBOX}
      style={style}
      preserveAspectRatio={preserveAspectRatio}
    />
  );
}
