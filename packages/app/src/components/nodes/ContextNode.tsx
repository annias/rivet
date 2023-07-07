import { FC } from 'react';
import { ContextNode } from '@ironclad/rivet-core';
import { NodeComponentDescriptor } from '../../hooks/useNodeTypes.js';

export const ContextNodeBody: FC<{
  node: ContextNode;
}> = ({ node }) => {
  return (
    <div>
      <h3>{node.data.id}</h3>
      <p>Type: {node.data.dataType}</p>
    </div>
  );
};
export const contextNodeDescriptor: NodeComponentDescriptor<'context'> = {
  Body: ContextNodeBody,
};
