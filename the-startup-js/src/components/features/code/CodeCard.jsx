import React, { useState } from "react";
import { Markup } from "./Markup";
import { Card } from "@/components/utils/Card";
import { PulseLine } from "@/components/utils/PulseLine";
import { BubbleButton } from "@/components/buttons/BubbleButton";
import { SiGithub } from "react-icons/si";
import { FiStar } from "react-icons/fi";

export const CodeCard = () => {
  const [selected, setSelected] = useState("js");

  return (
    <Card className="mx-auto max-w-3xl pt-3">
      <div className="-mx-9 mb-6 flex items-center justify-between border-b border-zinc-700 px-6 pb-3">
        <div className="flex items-center gap-3">
          <ToggleChip
            onClick={() => setSelected("js")}
            selected={selected === "js"}
          >
            JavaScript
          </ToggleChip>
          <ToggleChip
            onClick={() => setSelected("py")}
            selected={selected === "py"}
          >
            Python
          </ToggleChip>
        </div>
        <BubbleButton className="text-xs">
          <SiGithub />
          <FiStar className="hidden sm:inline" />
          <span className="hidden sm:inline">1,234</span>
        </BubbleButton>
      </div>
      <div className="no-scrollbar -mx-6 overflow-x-scroll px-6">
        <Markup
          code={selected === "js" ? javascriptCode : pythonCode}
          lang={selected === "js" ? "javascript" : "python"}
        />
      </div>
      <PulseLine />
    </Card>
  );
};

const ToggleChip = ({ children, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`rounded px-1.5 py-0.5 text-sm font-medium transition-colors ${selected ? "bg-blue-600 text-zinc-50" : "bg-zinc-900 text-zinc-50 hover:bg-zinc-700"}`}
    >
      {children}
    </button>
  );
};

const javascriptCode = `import { initializeSDK } from "your-package";

const app = initializeSDK({
    apiKey: "sk_abc123"
});

app.doCoolThing();`;

const pythonCode = `import your_package

app = your_package.init({
    "api_key": "sk_abc123"
})

app.do_cool_thing()`;
