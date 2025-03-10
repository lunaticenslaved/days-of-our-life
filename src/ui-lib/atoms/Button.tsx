import { nonReachable } from '#/shared/utils';
import { Color, getColorShade } from '#/ui-lib/utils/color';
import { getDimensions } from '#/ui-lib/utils/dimensions';
import { DEFAULT_SIZE, Size } from '#/ui-lib/utils/size';
import { TRANSITION_ALL } from '#/ui-lib/utils/transition';
import React from 'react';
import { LinkProps, Link } from 'react-router-dom';
import styled, { StyledObject } from 'styled-components';

// --- Settings ------------------------------------
type ButtonView = 'clear' | 'filled' | 'outlined';

const DEFAULT_COLOR: Color = 'primary';
const DEFAULT_VIEW: ButtonView = 'filled';

type CommonButtonProps = {
  color?: Color;
  size?: Size;
  view?: ButtonView;
  disabled?: boolean;
};

function getStyle({
  color = DEFAULT_COLOR,
  view = DEFAULT_VIEW,
  size = DEFAULT_SIZE,
}: CommonButtonProps): StyledObject {
  // TODO add disabled style
  const styles: StyledObject = {
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block',
  };

  if (size === 's') {
    styles.padding = getDimensions(1);
    styles.borderRadius = getDimensions(2);
  } else if (size === 'm') {
    styles.padding = getDimensions(2);
    styles.borderRadius = getDimensions(2);
  } else if (size === 'l') {
    styles.padding = getDimensions(4);
    styles.borderRadius = getDimensions(2);
  } else {
    nonReachable(size);
  }

  if (view === 'clear') {
    styles.backgroundColor = 'transparent';
    styles.color = getColorShade(color, 'main');

    styles['&:hover'] = {
      color: getColorShade('primary', 'main'),
    };
  } else if (view === 'filled') {
    styles.backgroundColor = getColorShade(color, 'main');
    styles.color = getColorShade(color, 'contrastText');
  } else if (view === 'outlined') {
    styles.border = `2px solid ${getColorShade(color, 'main')}`;
    styles.backgroundColor = 'transparent';
    styles.color = getColorShade(color, 'main');
  } else {
    nonReachable(view);
  }

  return {
    ...styles,
    textDecoration: 'none',
    transition: TRANSITION_ALL,
    width: 'max-content',
  };
}

// --- Root Button -------------------------------------------------------------------------
type ButtonProps = ButtonButtonProps | AnchorButtonProps | RouterLinkButtonProps;
export function Button(props: ButtonProps) {
  if (!props.component || props.component === 'button') {
    return <ButtonButton {...props} component="button" />;
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
const ButtonButton = styled.div.withConfig({})<ButtonButtonProps>(props => {
  const style = getStyle(props);

  return {
    ...style,
  };
});

// --- Anchor ------------------------------------------------------------------------------
type AnchorButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  CommonButtonProps & {
    component: 'anchor';
  };
const AnchorButton = styled.a<AnchorButtonProps>(props => {
  const style = getStyle(props);

  return {
    ...style,
  };
});

// --- Router Link ---------------------------------------------------------------------------
type RouterLinkButtonProps = LinkProps &
  React.RefAttributes<HTMLAnchorElement> &
  CommonButtonProps & {
    component: 'router-link';
  };
const RouterLinkButton = styled<typeof Link, RouterLinkButtonProps>(Link)(props => {
  const style = getStyle(props);

  return {
    ...style,
  };
});
