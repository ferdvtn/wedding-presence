import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<FormData>();
  const [isRedirect, setIsRedirect] = useState<boolean | null>(null);

  const loginMutation = useMutation<AxiosResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`,
        {
          username: data.username,
          password: data.password,
        }
      );
    },
    onSuccess: (data) => {
      sessionStorage.setItem("_token", data.data.token);
      router.push("/");
    },
  });

  useEffect(() => {
    const token = sessionStorage.getItem("_token");
    if (token) {
      setIsRedirect(true);
    } else {
      setIsRedirect(false);
    }
  }, []);

  if (isRedirect == null) {
    return;
  }

  if (isRedirect) {
    router.push("/");
    return;
  }

  return (
    <div className="relative flex flex-col justify-center items-center h-screen">
      {loginMutation.isError && (
        <small className="absolute text-center rounded p-1 bg-red-100 text-red-300 bottom-1 inset-x-1">
          {loginMutation.error.message}
        </small>
      )}
      <form
        className="bg-white shadow rounded px-8 py-6"
        onSubmit={handleSubmit((data) => {
          loginMutation.mutate(data);
        })}
      >
        <h2 className="text-3xl font-bold text-gray-700 mb-3">Login</h2>
        <div className="mb-4">
          <label
            className="block text-gray-500 text-sm font-bold mb-1"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="rounded w-full py-1 px-3 bg-gray-100 text-gray-500 text-sm leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            {...register("username", { required: true })}
          />
          {formState.errors.username && (
            <p className="text-red-500 text-xs mt-1">Username is required</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-500 text-sm font-bold mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="rounded w-full py-1 px-3 bg-gray-100 text-gray-500 text-sm leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            {...register("password", { required: true })}
          />
          {formState.errors.password && (
            <p className="text-red-500 text-xs mt-1">Password is required</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="rounded w-full py-1 px-3 bg-gray-300 text-gray-700 text-sm"
            type="submit"
          >
            Login
          </button>
        </div>
        <div className="w-full text-center mt-5 text-xs text-gray-500">
          Don&apos;t have an account ?
          <Link href="/register" className="underline">
            &nbsp;Register
          </Link>
        </div>
      </form>
    </div>
  );
}
