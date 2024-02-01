import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

// Form Component
interface FormProps {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  error: string | null;
}

interface FormValues {
  name: string;
  description: string;
  instruction: string;
}

export const FormComponent: React.FC<FormProps> = ({
  formValues,
  setFormValues,
  error,
}) => {
  // Form component code here...
  return (
    <form>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          value={formValues.name}
          onChange={(evt) =>
            setFormValues({
              ...formValues,
              name: evt.target.value,
            })
          }
          required
          placeholder="Name your GPT"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          value={formValues.description}
          onChange={(evt) =>
            setFormValues({
              ...formValues,
              description: evt.target.value,
            })
          }
          rows={5}
          placeholder="Add a short description about what this GPT does."
        ></textarea>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="instruction"
        >
          Instructions
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="instruction"
          value={formValues.instruction}
          onChange={(evt) =>
            setFormValues({
              ...formValues,
              instruction: evt.target.value,
            })
          }
          rows={5}
          placeholder="What does this GPT do? How does it behave? What should it avoid doing?"
        ></textarea>
      </div>
      {error && <ErrorAlert />} {/* Display error message if error */}
    </form>
  );
};

function ErrorAlert() {
  return (
    <Alert color="failure" className="mt-3" icon={HiInformationCircle}>
      <span className="font-medium">Error at Creating GPT!</span> There was an
      error at creating GPT, files could not be saved.
    </Alert>
  );
}
