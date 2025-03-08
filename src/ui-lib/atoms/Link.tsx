import { Color, getColorShade } from '#/ui-lib/utils/color';
import { HTMLAttributes } from 'react';
import styled from 'styled-components';

const DEAFULT_COLOR: Color = 'primary';

const getTextColor = ({ color = DEAFULT_COLOR }: Partial<ColorProps>) => {
  return color === 'inherit' ? 'inherit' : getColorShade(color, 'main');
};

type ColorProps = { color?: Color | 'inherit' };
type LinkProps = HTMLAttributes<HTMLAnchorElement> & Partial<ColorProps>;
export const Link = styled.a<LinkProps>`
  color: ${getTextColor};
  text-decoration: none;
`;
