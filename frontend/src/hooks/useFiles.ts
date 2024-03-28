import useSWRMutation from "swr/mutation";
import { API_BASE_URL } from "../utils/config";

export const useDeleteFile = (assistantId: string) => {
  const deleteFileMutation = useSWRMutation(
    `${API_BASE_URL}/assistants/${assistantId}/files`,
    (url, { arg }: { arg: string }) => deleteFile(url, arg)
  );

  return deleteFileMutation;
};

async function deleteFile(url: string, filename: string) {
  await fetch(`${url}/${filename}`, {
    method: "DELETE",
  });
}
