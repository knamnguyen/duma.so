"use client";

import { use } from "react";

import EditorClient from "./_components/editor-client";

type Props = {
  params: Promise<{ projectId: string }>;
};

export default function EditorProjectPage(props: Props) {
  const params = use(props.params);
  const { projectId } = params;

  return (
    <div className="container mx-auto bg-[radial-gradient(circle_at_top,_#f6f1eb,_#fdfdfd,_#e9edf2)] px-30 py-8">
      <EditorClient projectId={projectId} />
    </div>
  );
}
