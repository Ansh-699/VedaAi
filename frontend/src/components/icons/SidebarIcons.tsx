import { cn } from "@/lib/cn";

type IconProps = { className?: string };

/** 4-quadrant grid (Home / Topbar title) */
export function GridIcon({
  className,
  stroke = "#5E5E5E",
  strokeOpacity = 0.8,
}: IconProps & { stroke?: string; strokeOpacity?: number }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M17.5 11.6667H11.6667V17.5H17.5V11.6667Z"
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33333 11.6667H2.5V17.5H8.33333V11.6667Z"
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 2.5H11.6667V8.33333H17.5V2.5Z"
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33333 2.5H2.5V8.33333H8.33333V2.5Z"
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** People icon (My Groups) */
export function GroupsIcon({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.0053 0C19.1069 0 20 0.867353 20 1.93727V12.0627C20 12.8063 19.5687 13.452 18.9357 13.7767C18.7114 13.0842 18.552 12.599 18.4574 12.321C18.403 12.1608 18.3777 12.011 18.2979 11.8819C18.2236 11.7617 18.1006 11.6182 17.9791 11.4747L17.9521 11.4428C17.5516 10.968 17.0414 10.3553 16.609 9.82839C16.1946 9.32331 15.8524 8.89639 15.7181 8.78227C15.3989 8.51105 14.9468 8.21401 14.2686 8.21401H9.66755C9.62487 8.2067 9.53035 8.1911 9.41489 8.14943C8.91888 7.97045 7.88479 7.51948 7.36702 7.30995C6.21465 6.13586 5.35029 5.25332 4.77394 4.66235C4.72638 4.61361 4.61117 4.49397 4.42827 4.30347C4.20391 4.06978 3.83109 4.04594 3.57713 4.24907C3.32508 4.45067 3.28322 4.81013 3.48253 5.06133C5.29064 7.33994 6.21755 8.50276 6.2633 8.5498C6.37468 8.66433 6.70673 8.87699 7.11436 9.1439C7.53415 9.41875 8.03354 9.75 8.41755 10.0092C8.77511 10.2505 8.97606 10.3192 9.01596 10.655C9.10394 11.3955 9.21032 12.5105 9.33511 14H1.99468C0.893058 14 0 13.1326 0 12.0627V1.93727C0 0.867353 0.893058 0 1.99468 0H18.0053ZM15.7979 11.7915C15.9066 11.7819 16.0276 11.915 16.0771 11.9594C16.2486 12.1131 16.3003 12.1721 16.4096 12.2694C16.5691 12.4114 16.7331 12.5764 16.7553 12.6051C16.9727 12.99 17.2919 13.7639 17.4073 14L15.4654 14C15.5489 13.0617 15.6021 12.459 15.625 12.1919C15.6516 11.8819 15.6891 11.8011 15.7979 11.7915ZM12.4734 3.06088C11.1955 3.06088 10.1596 4.06699 10.1596 5.30811C10.1596 6.54922 11.1955 7.55534 12.4734 7.55534C13.7513 7.55534 14.7872 6.54922 14.7872 5.30811C14.7872 4.06699 13.7513 3.06088 12.4734 3.06088Z"
        fill="#5E5E5E"
        fillOpacity="0.8"
      />
    </svg>
  );
}

/** Assignment / file-with-tag icon */
export function AssignmentsIcon({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M7.5 14.1667H12.5"
        stroke="#5E5E5E"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7.5 10.8333H12.5"
        stroke="#5E5E5E"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7.5 7.5H8.33333"
        stroke="#5E5E5E"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4.1665 5C4.1665 3.61929 5.28579 2.5 6.6665 2.5H10.9761C11.4182 2.5 11.8421 2.67559 12.1547 2.98816L15.345 6.17851C15.6576 6.49107 15.8332 6.915 15.8332 7.35702V15C15.8332 16.3807 14.7139 17.5 13.3332 17.5H6.6665C5.28579 17.5 4.1665 16.3807 4.1665 15V5Z"
        stroke="#5E5E5E"
        strokeOpacity="0.8"
        strokeWidth="2"
      />
      <path
        d="M10.8335 2.5V4.16667C10.8335 6.00762 12.3259 7.5 14.1668 7.5H15.8335"
        stroke="#5E5E5E"
        strokeOpacity="0.8"
        strokeWidth="2"
      />
    </svg>
  );
}

/** Open book (AI Teacher's Toolkit) */
export function ToolkitIcon({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M3.3335 16.25C3.3335 15.6975 3.55299 15.1676 3.94369 14.7769C4.33439 14.3862 4.8643 14.1667 5.41683 14.1667H16.6668M3.3335 16.25C3.3335 16.8026 3.55299 17.3325 3.94369 17.7232C4.33439 18.1139 4.8643 18.3334 5.41683 18.3334H16.6668V1.66669H5.41683C4.8643 1.66669 4.33439 1.88618 3.94369 2.27688C3.55299 2.66758 3.3335 3.19749 3.3335 3.75002V16.25Z"
        stroke="#5E5E5E"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pie-chart icon (My Library) */
export function LibraryArcIcon({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M17.6752 13.2417C17.145 14.4954 16.3158 15.6002 15.2601 16.4594C14.2043 17.3187 12.9541 17.9062 11.6189 18.1707C10.2836 18.4351 8.90386 18.3685 7.6003 17.9765C6.29673 17.5845 5.10903 16.8792 4.14102 15.9222C3.17302 14.9652 2.45419 13.7856 2.04737 12.4866C1.64055 11.1876 1.55814 9.80874 1.80734 8.47053C2.05653 7.13232 2.62975 5.87553 3.47688 4.81003C4.324 3.74453 5.41924 2.90277 6.66684 2.35834"
        stroke="#5E5E5E"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 10C18.3333 8.90567 18.1178 7.82204 17.699 6.81099C17.2802 5.79994 16.6664 4.88129 15.8926 4.10746C15.1187 3.33364 14.2001 2.71981 13.189 2.30102C12.178 1.88224 11.0943 1.66669 10 1.66669V10H18.3333Z"
        stroke="#5E5E5E"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Sparkle decoration for the Create Assignment button (white) */
export function SparkleIcon({ className }: IconProps) {
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.63783 8.63783L6.18377 4H7.13246L8.6784 8.63783L13.3162 10.1838V11.1325L8.6784 12.6784L7.13246 17.3162H6.18377L4.63783 12.6784L0 11.1325V10.1838L4.63783 8.63783Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.3878 2.38783L14.1838 0H15.1325L15.9284 2.38783L18.3162 3.18377V4.13246L15.9284 4.9284L15.1325 7.31623H14.1838L13.3878 4.9284L11 4.13246V3.18377L13.3878 2.38783Z"
        fill="white"
      />
    </svg>
  );
}

/** Download icon (used in the output page intro banner). */
export function DownloadIcon({ className }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.224 5.05526C13.0206 5.00643 12.7929 5 12.0116 5H9.7998C8.94322 5 8.36092 5.00078 7.91083 5.03755C7.47242 5.07337 7.24821 5.1383 7.09181 5.21799C6.71549 5.40974 6.40953 5.7157 6.21778 6.09202C6.13809 6.24842 6.07317 6.47262 6.03735 6.91104C6.00057 7.36113 5.9998 7.94342 5.9998 8.8V12H3.9998L3.99979 8.7587C3.99978 7.95373 3.99977 7.28937 4.04399 6.74818C4.08991 6.18608 4.18848 5.66938 4.43577 5.18404C4.81926 4.43139 5.43118 3.81947 6.18383 3.43598C6.66917 3.18869 7.18587 3.09012 7.74797 3.0442C8.28916 2.99998 8.95353 2.99999 9.7585 3L12.0116 3C12.046 3 12.0799 2.99999 12.1135 2.99997C12.7484 2.99967 13.2282 2.99944 13.6909 3.11052C14.0991 3.20851 14.4893 3.37013 14.8471 3.58944C15.2529 3.83807 15.592 4.17749 16.0408 4.62672C16.0645 4.65043 16.0885 4.67445 16.1128 4.69878L18.301 6.88701C18.3253 6.91134 18.3494 6.93534 18.3731 6.95903C18.8223 7.40782 19.1617 7.74693 19.4104 8.15265C19.6297 8.51054 19.7913 8.90072 19.8893 9.30886C20.0004 9.77155 20.0001 10.2513 19.9998 10.8863C19.9998 10.9199 19.9998 10.9538 19.9998 10.9882V15.2413C19.9998 16.0463 19.9998 16.7106 19.9556 17.2518C19.9097 17.8139 19.8111 18.3306 19.5638 18.816C19.1803 19.5686 18.5684 20.1805 17.8158 20.564C17.3304 20.8113 16.8137 20.9099 16.2516 20.9558C15.7104 21 15.0461 21 14.2411 21H12.9998V19H14.1998C15.0564 19 15.6387 18.9992 16.0888 18.9625C16.5272 18.9266 16.7514 18.8617 16.9078 18.782C17.2841 18.5903 17.5901 18.2843 17.7818 17.908C17.8615 17.7516 17.9264 17.5274 17.9622 17.089C17.999 16.6389 17.9998 16.0566 17.9998 15.2V10.9882C17.9998 10.2069 17.9934 9.97916 17.9445 9.77575C17.8955 9.57168 17.8147 9.37659 17.7051 9.19765C17.5958 9.01929 17.4393 8.85373 16.8868 8.30122L14.6986 6.113C14.1461 5.56048 13.9805 5.40402 13.8022 5.29472C13.6232 5.18506 13.4281 5.10426 13.224 5.05526Z"
        fill="#303030"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.52545 16.5257L6.43059 13.8103H7.56901L8.47414 16.5257L11.1895 17.4308V18.5692L8.47414 19.4743L7.56901 22.1897H6.43059L5.52545 19.4743L2.81006 18.5692V17.4308L5.52545 16.5257Z"
        fill="#303030"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.9998 5V9H17.9998V11H12.9998C12.4475 11 11.9998 10.5523 11.9998 10V5H13.9998Z"
        fill="#303030"
      />
    </svg>
  );
}
