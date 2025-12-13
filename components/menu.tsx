"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const menuGroups = [
  {
    label: "JS Frameworks",
    items: ["React", "Solid", "Vue", "Svelte"],
  },
  {
    label: "CSS Frameworks",
    items: ["Panda", "Tailwind"],
  },
];

export const Basic = () => (
  <div className="flex justify-center mt-10">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Open menu
          <ChevronDown size={16} className="opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52">
        {menuGroups.map((group, gIndex) => (
          <div key={group.label}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="uppercase">
                {group.label}
              </DropdownMenuLabel>
              {group.items.map((item) => (
                <DropdownMenuItem
                  key={item}
                  className="cursor-pointer"
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            {gIndex < menuGroups.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
