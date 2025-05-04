import { nonReachable } from '#/shared/utils';
import { THEME } from '#/ui-lib/theme';
import { Color, ColorProps, getColor, getTextColor } from '#/ui-lib/utils/color';
import { checkProps } from '#/ui-lib/utils/common';
import { getDimensions } from '#/ui-lib/utils/dimensions';
import { DEFAULT_SIZE, Size } from '#/ui-lib/utils/size';
import { getSpacingStyles } from '#/ui-lib/utils/spacing';
import { TRANSITION_ALL } from '#/ui-lib/utils/transition';
import { getWidthStyles, SHOULD_FORWARD_WIDTH, WidthProps } from '#/ui-lib/utils/width';
import React, { ComponentProps } from 'react';
import { LinkProps, Link } from 'react-router-dom';
import styled, { StyledObject } from 'styled-components';

// --- Settings ------------------------------------
type ButtonView = 'clear' | 'filled' | 'toned' | 'outlined';
export const BUTTON_VIEWS: ButtonView[] = ['clear', 'filled', 'toned', 'outlined'];

const DEFAULT_COLOR: Color = 'primary';
const DEFAULT_VIEW: ButtonView = 'filled';

// FIXME add disabled and loading ui
type CommonButtonProps = ColorProps &
  WidthProps & {
    size?: Size;
    view?: ButtonView;
    disabled?: boolean;
    loading?: boolean;
  };

const shouldForwardProp = checkProps<CommonButtonProps>({
  loading: false,
  disabled: false,
  color: false,
  size: false,
  view: false,
  ...SHOULD_FORWARD_WIDTH,
});

function getStyle({
  color = DEFAULT_COLOR,
  view = DEFAULT_VIEW,
  size = DEFAULT_SIZE,
  ...props
}: CommonButtonProps): StyledObject {
  // TODO add disabled style
  // TODO add hover style
  const styles: StyledObject = {
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: getDimensions(THEME.components.button.height[size]),
    borderRadius: getDimensions(THEME.components.button.borderRadius[size]),
    ...getSpacingStyles(THEME.components.button.spacing[size]),
  };

  if (view === 'clear') {
    styles.backgroundColor = 'transparent';
    styles.color = getColor({ color, shade: 'main' });

    styles['&:hover'] = {
      backgroundColor: 'rgba(255,255,255,0.1)',
    };
  } else if (view === 'filled') {
    styles.backgroundColor = getColor({ color, shade: 'main' });
    styles.color = getTextColor(color);

    styles['&:hover'] = {
      backgroundColor: 'rgba(255,255,255,0.6)',
    };
  } else if (view === 'outlined') {
    styles.border = `${THEME.components.button.borderWidth} solid ${getColor({
      color,
      shade: 'main',
    })}`;
    styles.backgroundColor = 'transparent';
    styles.color = getColor({ color, shade: 'main' });

    styles['&:hover'] = {
      backgroundColor: 'rgba(255,255,255,0.1)',
    };
  } else if (view === 'toned') {
    styles.backgroundColor = 'rgba(255,255,255,0.05)';
    styles.color = getColor({ color, shade: 'main' });

    styles['&:hover'] = {
      backgroundColor: 'rgba(255,255,255,0.20)',
    };
  } else {
    nonReachable(view);
  }

  return {
    ...styles,
    textDecoration: 'none',
    transition: TRANSITION_ALL,
    width: 'max-content',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    ...getWidthStyles(props),
  };
}

// --- Root Button -------------------------------------------------------------------------
type ButtonProps = ButtonButtonProps | AnchorButtonProps | RouterLinkButtonProps;
export function Button(props: ButtonProps) {
  if (!props.component || props.component === 'button') {
    return <ButtonButton type="button" {...props} component="button" />;
  } else if (props.component === 'anchor') {
    return <AnchorButton {...props} component="anchor" />;
  } else if (props.component === 'router-link') {
    return <RouterLinkButton {...props} component="router-link" />;
  }
}

// --- Button ------------------------------------------------------------------------------
type ButtonButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  CommonButtonProps & {
    component?: 'button';
  };
const ButtonButtonComponent = styled.button.withConfig({
  shouldForwardProp,
})<ButtonButtonProps>(props => {
  const style = getStyle(props);

  return {
    ...style,
  };
});
function ButtonButton(props: ComponentProps<typeof ButtonButtonComponent>) {
  return <ButtonButtonComponent type="button" {...props} />;
}

// --- Anchor ------------------------------------------------------------------------------
type AnchorButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  CommonButtonProps & {
    component: 'anchor';
  };
const AnchorButton = styled.a.withConfig({ shouldForwardProp })<AnchorButtonProps>(
  props => {
    const style = getStyle(props);

    return {
      ...style,
    };
  },
);

// --- Router Link ---------------------------------------------------------------------------
type RouterLinkButtonProps = LinkProps &
  React.RefAttributes<HTMLAnchorElement> &
  CommonButtonProps & {
    component: 'router-link';
  };
const RouterLinkButton = styled<typeof Link, RouterLinkButtonProps>(Link).withConfig({
  shouldForwardProp,
})(props => {
  const style = getStyle(props);

  return {
    ...style,
  };
});
