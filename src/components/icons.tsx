import type { SVGProps } from 'react';

export function AshokaChakraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      {...props}
    >
      <circle cx="50" cy="50" r="45" />
      <circle cx="50" cy="50" r="8" fill="currentColor" stroke="none" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2="50"
          y2="5"
          transform={`rotate(${i * 15}, 50, 50)`}
        />
      ))}
    </svg>
  );
}
