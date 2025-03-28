import { nonReachable } from '#/shared/utils';
import { checkProps } from '#/ui-lib/utils/common';
import { getDimensions } from '#/ui-lib/utils/dimensions';
import styled, { CSSProperties, StyledObject } from 'styled-components';

// --- Settings ---------------------------------------------------------------------------
type TextVariant = 'body-m' | 'header-m';
type CommonTextProps = {
  variant?: TextVariant;
  whiteSpace?: CSSProperties['whiteSpace'];
};

const shouldForwardProp = checkProps<CommonTextProps>({
  variant: false,
  whiteSpace: false,
});

const DEFAULT_VARIANT: TextVariant = 'body-m';

function getStyles({
  variant = DEFAULT_VARIANT,
  whiteSpace,
}: CommonTextProps): StyledObject {
  const result: StyledObject = {
    whiteSpace,
  };

  if (variant === 'body-m') {
    result.fontSize = getDimensions(3.5);
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
