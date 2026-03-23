import { useQueryState } from "nuqs";
import { type FC, useState } from "react";

import { Input } from "@/components/ui/input";

interface FilterTestProps {}

const FilterTest: FC<FilterTestProps> = ({}) => {
  const [name, setName] = useQueryState("name", { defaultValue: "" });
  const [job, setJob] = useQueryState("job", { defaultValue: "" });

  return (
    <div>
      <p>Name: {name}</p>
      <Input
        name="name"
        value={name || undefined}
        onChange={(e) => setName(e.target.value)}
        placeholder="name"
      />
      <p>Job: {job}</p>
      <Input
        name="job"
        value={job || ""}
        onChange={(e) => setJob(e.target.value)}
        placeholder="job"
      />
    </div>
  );
};

export default FilterTest;
