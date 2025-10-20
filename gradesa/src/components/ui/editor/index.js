import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./ClientEditor"), { ssr: false });

export default Editor;
