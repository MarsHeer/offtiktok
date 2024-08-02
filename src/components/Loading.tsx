export const LoadingSpinner = ({ width = 20, height = 20 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width={width}
      height={width}
      style={{
        shapeRendering: 'auto',
        display: 'block',
        background: 'transparent',
      }}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <g transform="rotate(0 50 50)">
          <rect fill="#000000" height="6" width="6" ry="3" rx="3" y="27" x="47">
            <animate
              repeatCount="indefinite"
              begin="-0.9s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(36 50 50)">
          <rect fill="#000000" height="6" width="6" ry="3" rx="3" y="27" x="47">
            <animate
              repeatCount="indefinite"
              begin="-0.8s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(72 50 50)">
          <rect fill="#000000" height="6" width="6" ry="3" rx="3" y="27" x="47">
            <animate
              repeatCount="indefinite"
              begin="-0.7s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(108 50 50)">
          <rect fill="#000000" height="6" width="6" ry="3" rx="3" y="27" x="47">
            <animate
              repeatCount="indefinite"
              begin="-0.6s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(144 50 50)">
          <rect fill="#000000" height="6" width="6" ry="3" rx="3" y="27" x="47">
            <animate
              repeatCount="indefinite"
              begin="-0.5s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(180 50 50)">
          <rect fill="#000000" height="6" width="6" ry="3" rx="3" y="27" x="47">
            <animate
              repeatCount="indefinite"
              begin="-0.4s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(216 50 50)">
          <rect fill="#000000" height="6" width="6" ry="3" rx="3" y="27" x="47">
            <animate
              repeatCount="indefinite"
              begin="-0.3s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(252 50 50)">
          <rect fill="#000000" height="6" width="6" ry="3" rx="3" y="27" x="47">
            <animate
              repeatCount="indefinite"
              begin="-0.2s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(288 50 50)">
          <rect fill="#000000" height="6" width="6" ry="3" rx="3" y="27" x="47">
            <animate
              repeatCount="indefinite"
              begin="-0.1s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(324 50 50)">
          <rect fill="#000000" height="6" width="6" ry="3" rx="3" y="27" x="47">
            <animate
              repeatCount="indefinite"
              begin="0s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g></g>
      </g>
    </svg>
  );
};
