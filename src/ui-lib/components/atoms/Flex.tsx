import { Dimension, getDimensions } from '#/ui-lib/utils/dimensions';
import { CSSProperties } from 'react';
import styled from 'styled-components';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { getHeightStyles, HeightProps } from '#/ui-lib/utils/height';
import { getSpacingStyles, SpacingProps } from '#/ui-lib/utils/spacing';
import { getWidthStyles, WidthProps } from '#/ui-lib/utils/width';
import { FlexChildProps, getFlexChildStyles } from '#/ui-lib/utils/flex';
import { getOverflowStyles, OverflowProps } from '#/ui-lib/utils/overflow';
import { BorderProps, getBorderStyles } from '#/ui-lib/utils/border';

// --- Settings ---------------------------------------------------------------
const DEFAULT_GAP: Dimension = 0;

// --- Flex Root --------------------------------------------------------------
type FlexRootProps = React.HTMLAttributes<HTMLDivElement> &
  SpacingProps &
  HeightProps &
  WidthProps &
  FlexChildProps &
  BorderProps &
  OverflowProps &
  Pick<CSSProperties, 'alignItems' | 'justifyContent' | 'flexWrap'> & {
    component?: 'div';
    direction?: CSSProperties['flexDirection'];
    gap?: Dimension | `${Dimension} ${Dimension}`;
  };

// FIXME omit props

const FlexRoot = styled.div.withConfig({ shouldForwardProp })<FlexRootProps>(props => {
  let gap: CSSProperties['gap'] = undefined;

  if (!props.gap) {
    //
  } else if (typeof props.gap === 'number') {
    gap = getDimensions(props.gap);
  } else if (typeof props.gap === 'string') {
    const [row, column] = props.gap.split(' ');

    gap = `${getDimensions(Number(row) || DEFAULT_GAP)} ${getDimensions(
      Number(column) || DEFAULT_GAP,
    )}`;
  }

  return {
    display: 'flex',
    flexDirection: props.direction,
    alignItems: props.alignItems,
    justifyContent: props.justifyContent,
    flexWrap: props.flexWrap,
    gap,
    ...getSpacingStyles(props.spacing || {}),
    ...getHeightStyles(props),
    ...getWidthStyles(props),
    ...getFlexChildStyles(props),
    ...getOverflowStyles(props),
    ...getBorderStyles(props),
  };
});

export { FlexRoot as Flex };
