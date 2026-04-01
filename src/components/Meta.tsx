import { format as datefnsFormat } from "date-fns";
import * as React from "react";
import slugify from "slugify";

import { Badge } from "@/components/ui/badge";
import {
  type BlogData,
  type Paths,
  type SermonData,
  isBlogData,
  isSermonData,
} from "@/data/types";
import { cn } from "@/lib/utils";
import { compactRef } from "@/utils/scriptureParsing";
import useIsMobile from "@/utils/useIsMobile";

interface MetaProps {
  data: SermonData | BlogData;
  variant?: "muted" | "outline";
  linked?: boolean;
  paths: Paths;
}

const Meta: React.FC<MetaProps> = ({
  data: dataProp,
  variant = "muted",
  linked = true,
  paths,
}) => {
  const {
    data: { date },
  } = dataProp;

  const isCompact = useIsMobile();

  const metaItems: (string | React.JSX.Element)[] = [];

  if (date) {
    metaItems.push(
      datefnsFormat(date, isCompact ? "MM/dd/yy" : "LLLL do, yyyy"),
    );
  }

  if (isSermonData(dataProp)) {
    const {
      preacher,
      series,
      data: { scripture },
    } = dataProp;

    if (scripture)
      scripture.forEach((ref) => {
        if (!ref.osis || !ref.text) {
          return;
        }
        metaItems.push(isCompact ? compactRef(ref.osis) : ref.text);
      });

    if (preacher)
      metaItems.push(
        linked && paths.sermons ? (
          <a
            href={`/${paths.sermons.path}/?preacher=${slugify(preacher.data.name, { strict: true }).toLowerCase()}`}
          >
            {preacher.data.name}
          </a>
        ) : (
          preacher.data.name
        ),
      );
    if (series)
      metaItems.push(
        linked && paths.sermons ? (
          <a
            href={`/${paths?.sermons.path}/?series=${slugify(series.data.title, { strict: true }).toLowerCase()}`}
          >
            {series.data.title}
          </a>
        ) : (
          series.data.title
        ),
      );
  }

  if (isBlogData(dataProp)) {
    const { tags } = dataProp.data;
    if (tags)
      tags.forEach((tag) =>
        metaItems.push(
          linked && paths.blog ? (
            <a
              href={`/${paths?.blog.path}/?tag=${tag}`}
              className="not-prose"
              key={tag}
            >
              {tag}
            </a>
          ) : (
            tag
          ),
        ),
      );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {metaItems.map((item, index) => (
        <Badge
          variant={variant}
          className={cn(
            "max-w-full",
            variant === "outline" ? "text-muted-foreground" : "",
          )}
          key={index}
        >
          <span className="truncate">{item}</span>
        </Badge>
      ))}
    </div>
  );
};

export default Meta;
