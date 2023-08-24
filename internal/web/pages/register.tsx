import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
}

const Register: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch, formState } = useForm<FormData>();
  const [isRedirect, setIsRedirect] = useState<boolean | null>(null);

  const registerMutation = useMutation({
    mutationFn: (data: FormData) => {
      return axios.post("http://172.31.26.210:1323/api/v1/users/register", {
        username: data.username,
        password: data.password,
      });
    },
    onSuccess: (data, variables, context) => {
      router.push("login");
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

  const onSubmit = (data: FormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form
        className="bg-white shadow rounded px-8 py-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-3xl font-bold text-gray-700 mb-3">Register</h2>
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
        <div className="mb-4">
          <label
            className="block text-gray-500 text-sm font-bold mb-1"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            className="rounded w-full py-1 px-3 bg-gray-100 text-gray-500 text-sm leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) => value === watch("password"),
            })}
          />
          {formState.errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              Passwords don&apos;t match
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="rounded w-full py-1 px-3 bg-gray-300 text-gray-700 text-sm"
            type="submit"
          >
            Register
          </button>
        </div>
        <div className="w-full text-center mt-5 text-xs text-gray-500">
          Already have an account ?
          <Link href="/login" className="underline">
            &nbsp;Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
