declare module '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge' {
  export type Edge = 'top' | 'bottom' | 'left' | 'right' | null;
  export function attachClosestEdge(args: any): any;
  export function extractClosestEdge(data: any): Edge;
}
