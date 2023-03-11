import dynamic from "next/dynamic";
const Landing = dynamic(() => import("./Landing"), {
  ssr: false,
});

export default () => <Landing />;
