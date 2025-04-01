import { nonReachable } from '#/shared/utils';
import { checkProps } from '#/ui-lib/utils/common';
import { getDimensions } from '#/ui-lib/utils/dimensions';
import { getWidthStyles, SHOULD_FORWARD_WIDTH, WidthProps } from '#/ui-lib/utils/width';
import styled, { CSSProperties, StyledObject } from 'styled-components';

// --- Settings ---------------------------------------------------------------------------
type TextVariant = 'body-m' | 'body-s' | 'header-m';
type CommonTextProps = Pick<CSSProperties, 'whiteSpace' | 'wordWrap'> &
  WidthProps & {
    variant?: TextVariant;
  };

const shouldForwardProp = checkProps<CommonTextProps>({
  variant: false,
  whiteSpace: false,
  wordWrap: false,
  ...SHOULD_FORWARD_WIDTH,
});

const DEFAULT_VARIANT: TextVariant = 'body-m';

function getStyles({
  variant = DEFAULT_VARIANT,
  whiteSpace,
  wordWrap,
  ...props
}: CommonTextProps): StyledObject {
  const result: StyledObject = {
    whiteSpace,
    wordWrap,
    ...getWidthStyles(props),
  };

  if (variant === 'body-m') {
    result.fontSize = getDimensions(3.5);
  } else if (variant === 'body-s') {
    result.fontSize = getDimensions(3);
  } else if (variant === 'header-m') {
    result.fontSize = getDimensions(5);
  } else {
    nonReachable(variant);
  }

  return result;
}

// --- Root -------------------------------------------------------------------------------
type TextProps = DivProps | ParagraphProps;
export function Text(props: TextProps) {
  if (!props.component || props.component === 'div') {
    return <Div {...props} component="div" />;
  } else if (props.component === 'p') {
    return <Paragraph {...props} component="p" />;
  } else {
    nonReachable(props.component);
  }
}

// --- Div --------------------------------------------------------------------------------
type DivProps = React.HTMLAttributes<HTMLDivElement> &
  CommonTextProps & {
    component?: 'div';
  };
const Div = styled.div.withConfig({ shouldForwardProp })<DivProps>(getStyles);

// --- Paragraph --------------------------------------------------------------------------
type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> &
  CommonTextProps & {
    component: 'p';
  };
const Paragraph = styled.p.withConfig({ shouldForwardProp })<ParagraphProps>(getStyles);
