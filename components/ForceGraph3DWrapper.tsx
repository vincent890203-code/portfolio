"use client";

// next/dynamic 的 LoadableComponent 不會轉發 React ref 給底層元件。
// 用這個 wrapper 把 ref 當成普通 prop(innerRef)傳進去,繞過限制。
import ForceGraph3D from "react-force-graph-3d";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ForceGraph3DWrapper({ innerRef, ...props }: any) {
  return <ForceGraph3D ref={innerRef} {...props} />;
}
