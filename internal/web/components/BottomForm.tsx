import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineFileAdd } from "react-icons/ai";

interface FormData {
  name: string;
  money_gift: number;
  adds_gift: string;
}

interface BottomFormProps {
  refetchFn: () => void;
  totalPerson: number;
}

const BottomForm = (props: BottomFormProps) => {
  const { register, handleSubmit, formState, reset } = useForm<FormData>();
  const [isFocus, setIsFocus] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      return axios.post(
        `http://127.0.0.1:1323/api/v1/guests`,
        {
          name: data.name,
          money_gift: Number(data.money_gift),
          adds_gift: data.adds_gift,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("_token")}`,
          },
        }
      );
    },
    onSuccess(data, variables, context) {
      console.log("success", data);
      reset();
      props.refetchFn();
      setIsFocus(false);
    },
    onError(error, variables, context) {
      console.log("error", error);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed w-full flex flex-col justify-center items-center bg-white bottom-0">
      {/* Insert form */}
      <div
        className={`w-full py-2 justify-center items-center border-b ${
          isFocus ? "flex" : "hidden"
        }`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-col space-y-2 w-2/3`}
        >
          <input
            {...register("name", { required: true })}
            placeholder="Guest Name"
            className={`py-1 px-2 w-full text-sm text-gray-500 bg-gray-100 rounded border border-transparent ${
              formState.errors.name && "border-red-400 bg-red-100"
            }`}
          />
          <input
            {...register("money_gift", { required: true })}
            type="number"
            placeholder="IDR 0"
            className={`py-1 px-2 w-full text-sm text-gray-500 bg-gray-100 rounded border border-transparent ${
              formState.errors.money_gift && "border-red-400 bg-red-100"
            }`}
          />
          <textarea
            {...register("adds_gift")}
            placeholder="Bag, Shoes, etc.."
            rows={2}
            className="py-1 px-2 w-full text-sm text-gray-500 bg-gray-100 rounded border border-transparent resize-none"
          />
          <button
            type="submit"
            className="py-1 px-2 text-sm bg-gray-300 text-gray-500 rounded hover:bg-gray-400 hover:text-gray-600 focus:bg-gray-400 focus:text-gray-600"
          >
            Create
          </button>
        </form>
      </div>

      {/* Fixed footer */}
      <div className="w-full p-2 flex justify-center items-center">
        <small className="text-gray-400 text-xs">
          {props.totalPerson} persons
        </small>
        <button
          className="absolute right-3"
          onClick={() => setIsFocus(!isFocus)}
        >
          {isFocus ? (
            <small className="text-gray-500  text-xs">close</small>
          ) : (
            <AiOutlineFileAdd className="text-gray-500 text-lg" />
          )}
        </button>
      </div>
    </div>
  );
};

export default BottomForm;
