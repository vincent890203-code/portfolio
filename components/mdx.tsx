import type { MDXComponents } from "mdx/types";

// MDX 正文樣式對應。無 typography plugin,直接為各元素上樣式。
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-10 text-xl font-bold text-text" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-6 text-lg font-medium text-text" {...props} />
  ),
  p: (props) => (
    <p className="mt-4 leading-relaxed text-dim" {...props} />
  ),
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-dim" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-dim" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  a: (props) => (
    <a
      className="text-cool underline underline-offset-2 hover:text-warm"
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-text" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-line pl-4 font-mono text-sm text-dim"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-line/50 px-1.5 py-0.5 font-mono text-[0.85em] text-cool"
      {...props}
    />
  ),
};
