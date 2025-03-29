import { nonReachable } from '#/shared/utils';
import { FlexChildProps, getFlexChildStyles } from '#/ui-lib/utils/flex';
import { getHeightStyles, HeightProps } from '#/ui-lib/utils/height';
import { getOverflowStyles, OverflowProps } from '#/ui-lib/utils/overflow';
import React from 'react';
import styled, { StyledObject } from 'styled-components';
import {
  ColorInherit,
  ColorProps,
  ColorTransparent,
  getColor,
  getTextColor,
} from '#/ui-lib/utils/color';
import { checkProps } from '#/ui-lib/utils/common';
import { getSpacingStyles, SpacingProps } from '#/ui-lib/utils/spacing';
import { getWidthStyles, WidthProps } from '#/ui-lib/utils/width';
import { BorderProps, getBorderStyles } from '#/ui-lib/utils/border';

// --- Settings ---------------------------------------------------------------
const DEFAULT_BG_COLOR = 'transparent';

type CommonProps = SpacingProps &
  OverflowProps &
  HeightProps &
  WidthProps &
  FlexChildProps &
  BorderProps &
  ColorProps<ColorInherit | ColorTransparent>;

const shouldForwardProp = checkProps<CommonProps>({
  color: false,
  flexGrow: false,
  height: false,
  overflow: false,
  spacing: false,
  width: false,
  borderRadius: false,
  borderWidth: false,
});

function getStyles({ color = DEFAULT_BG_COLOR, ...props }: CommonProps): StyledObject {
  const result: StyledObject = {
    ...getSpacingStyles(props.spacing || {}),
    ...getOverflowStyles(props),
    ...getHeightStyles(props),
    ...getWidthStyles(props),
    ...getFlexChildStyles(props),
    ...getBorderStyles(props),
    backgroundColor: getColor({ color, shade: 'main' }),
    color: getTextColor(color),
  };

  return result;
}

// --- Box Root ---------------------------------------------------------------
type BoxProps =
  | SectionBoxProps
  | SpanBoxProps
  | DivBoxProps
  | AsideBoxProps
  | NavBoxProps;

export function Box(props: BoxProps) {
  if (!props.component || props.component === 'div') {
    return <DivBox {...props} component="div" />;
  } else if (props.component === 'section') {
    return <SectionBox {...props} component="section" />;
  } else if (props.component === 'span') {
    return <SpanBox {...props} component="span" />;
  } else if (props.component === 'aside') {
    return <AsideBox {...props} component="aside" />;
  } else if (props.component === 'nav') {
    return <NavBox {...props} component="nav" />;
  } else {
    nonReachable(props.component);
  }
}

// --- Div Box ---------------------------------------------------------------
type DivBoxProps = React.HTMLAttributes<HTMLDivElement> &
  CommonProps & { component?: 'div' };
const DivBox = styled.div.withConfig({ shouldForwardProp })<DivBoxProps>(getStyles);

// --- Span Box ---------------------------------------------------------------
type SpanBoxProps = React.HTMLAttributes<HTMLSpanElement> &
  CommonProps & { component: 'span' };
const SpanBox = styled.span.withConfig({ shouldForwardProp })<SpanBoxProps>(getStyles);

// --- Section Box ---------------------------------------------------------------
type SectionBoxProps = React.HTMLAttributes<HTMLElement> &
  CommonProps & { component: 'section' };
const SectionBox = styled.section.withConfig({ shouldForwardProp })<SectionBoxProps>(
  getStyles,
);

// --- Aside Box ---------------------------------------------------------------
type AsideBoxProps = React.HTMLAttributes<HTMLElement> &
  CommonProps & { component: 'aside' };
const AsideBox = styled.aside.withConfig({ shouldForwardProp })<AsideBoxProps>(getStyles);

// --- Nav Box ---------------------------------------------------------------
type NavBoxProps = React.HTMLAttributes<HTMLElement> & CommonProps & { component: 'nav' };
const NavBox = styled.nav.withConfig({ shouldForwardProp })<NavBoxProps>(getStyles);
