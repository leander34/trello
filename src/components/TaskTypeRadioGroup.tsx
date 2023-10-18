"use client";
import { useBoardStore } from "@/store/BoardStore";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import classnames from "classnames";

const types = [
  {
    id: "todo",
    name: "Todo",
    description: "A new task to be completed",
    color: "bg-red-500",
  },
  {
    id: "inprogress",
    name: "In Progress",
    description: "A task that is currently being worked on",
    color: "bg-yellow-500",
  },
  {
    id: "done",
    name: "Done",
    description: "A task that has been completed",
    color: "bg-green-500",
  },
];

export default function TaskTypeRadioGroup() {
  const { setNewTaskType, newTaskType } = useBoardStore();

  return (
    <div className="w-full py-5">
      <div className="mx-auto -wfull max-w-md">
        <RadioGroup value={newTaskType} onChange={(e) => setNewTaskType(e)}>
          <div className="space-y-2">
            {types.map((type) => (
              <RadioGroup.Option
                key={type.id}
                value={type.id}
                className={({ active, checked }) =>
                  classnames(
                    `relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none ${
                      checked ? type.color : ""
                    }`,
                    {
                      "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300":
                        active,
                    },
                    {
                      "bg-opacity-75 text-white": checked,
                    },
                    {
                      "bg-white": !checked,
                    }
                  )
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={classnames(
                              "font-medium",
                              {
                                "text-white": checked,
                              },
                              {
                                "text-gray-900": !checked,
                              }
                            )}
                          >
                            {type.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={classnames(
                              "inline",
                              {
                                "text-white": checked,
                              },
                              {
                                "text-gray-500": !checked,
                              }
                            )}
                          >
                            {type.description}
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckCircleIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
