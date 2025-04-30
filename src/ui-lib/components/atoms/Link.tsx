import { Color, ColorInherit, getTextColor } from '#/ui-lib/utils/color';
import { HTMLAttributes } from 'react';
import styled from 'styled-components';

// --- Settings -----------------------------------------------------------------
const DEFAULT_COLOR = 'primary';

type CommonProps = {
  color?: Color | ColorInherit;
};

// --- Link ---------------------------------------------------------------------
type LinkProps = HTMLAttributes<HTMLAnchorElement> & CommonProps;
export const Link = styled.a<LinkProps>`
  color: ${props => {
    return getTextColor(props.color || DEFAULT_COLOR);
  }};
  text-decoration: none;
`;
