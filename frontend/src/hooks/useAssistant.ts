import { useState, useEffect } from "react";
import { Config } from "./useConfigList";
import { API_BASE_URL } from "../utils/config";

export function useFetchAssistantConfig(id: string | null) {
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/assistants/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Config = await response.json();
        setConfig(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unexpected error occurred"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id !== null) {
      fetchConfig();
    }
  }, [id]);

  return { config, isLoading, error };
}
