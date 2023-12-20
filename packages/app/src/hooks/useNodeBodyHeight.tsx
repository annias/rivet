import { type NodeId } from '@ironclad/rivet-core';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { nodesState } from '../state/graph';

export interface NodeHeightCache {
  get: (nodeId: NodeId) => number | undefined;

  has: (nodeId: NodeId) => boolean;

  set: (nodeId: NodeId, height: number | undefined) => void;
}

/**
 * A cache of node heights. This is used when a node is unmounted and moved to the dragging list, since the node's
 * body needs to be re-rendered in order to get its height. This cache allows us to avoid flickering when the node
 * is first rendered in the dragging list.
 */
export const useNodeHeightCache = (): NodeHeightCache => {
  const nodes = useRecoilValue(nodesState);
  const ref = useRef<Record<string, number | undefined>>({});

  const set = useCallback((nodeId: NodeId, height: number | undefined) => {
    ref.current[nodeId] = height;
  }, []);

  const get = useCallback((nodeId: NodeId) => {
    return ref.current[nodeId];
  }, []);

  const has = useCallback((nodeId: NodeId) => {
    return nodeId in ref.current;
  }, []);

  return useMemo(() => {
    const pre = ref.current;
    ref.current = nodes.reduce((acc, next) => {
      acc[next.id] = pre[next.id];
      return acc;
    }, {} as Record<string, number | undefined>);
    return { set, get, has } satisfies NodeHeightCache;
  }, [nodes, set, get, has]);
};

/**
 * This hook persist the last known height of a node's body to the height cache, and can later use that last known
 * height temporarily while the node is waiting for the body to be available.
 */
export const useNodeBodyHeight = (cache: NodeHeightCache, nodeId: NodeId, ready: boolean) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready) {
      cache.set(nodeId, ref.current?.getBoundingClientRect().height);
    }
  }, [cache, nodeId, ready]);

  return { ref, height: !ready && cache.has(nodeId) ? `${cache.get(nodeId)}px` : undefined };
};
