"use client";

import React from "react";
import { type DividerState } from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import InputControl from "@/components/shared/input/Input";
import Select from "@/components/shared/input/Select";

type SetterValue<T> = T | ((prev: T) => T);
type DividerSetter = <K extends keyof DividerState>(
  key: K,
) => (val: SetterValue<DividerState[K]>) => void;

type Props = {
  state: DividerState;
  setKey: DividerSetter;
};

export default function DividerMetadataSection({ state, setKey }: Props) {
  return (
    <div className="space-y-6">
      <Section title="Metadata" subtitle="Semantic role and screen reader naming">
        <div className="space-y-4">
          <ControlGroup label="Role">
            <Select
              value={state.ariaRole}
              onChange={(v) =>
                setKey("ariaRole")(v as DividerState["ariaRole"])
              }
              options={[
                { value: "separator", label: "separator - Content divider" },
                { value: "presentation", label: "presentation - Decorative" },
                { value: "none", label: "none - No semantic meaning" },
              ]}
            />
          </ControlGroup>

          <ControlGroup label="ARIA Label">
            <InputControl
              value={state.ariaLabel}
              onChange={setKey("ariaLabel")}
              placeholder="e.g. Section divider"
            />
          </ControlGroup>
        </div>
      </Section>
    </div>
  );
}
