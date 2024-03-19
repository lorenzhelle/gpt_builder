import { Button, Card } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {}

export const NewGPT: React.FC<Props> = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 justify-center">
      <Card className="max-w-sm">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          No GPT found
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          In order to start a chat, you need to create your own GPT first.
        </p>
        <Button onClick={() => navigate({ pathname: "/create" })}>
          Create GPT
          <svg
            className="-mr-1 ml-2 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </Card>
    </div>
  );
};
