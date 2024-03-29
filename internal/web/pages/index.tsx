import BottomForm from "@/components/BottomForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineSearch, AiOutlineUserDelete } from "react-icons/ai";

interface Guest {
  id: number;
  name: string;
  money_gift: number;
  adds_gift: string;
}

export default function IndexPage() {
  const router = useRouter();
  const ucwords = require("ucwords");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestsToShow, setGuestsToShow] = useState<Guest[]>([]);
  const { handleSubmit } = useForm();
  const deleteMutation = useMutation<AxiosResponse, AxiosError, number>({
    mutationFn: async (guestId) => {
      return axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/guests/${guestId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("_token")}`,
          },
        }
      );
    },
    onSuccess() {
      refetch();
    },
  });

  const { isLoading, isError, error, refetch } = useQuery<Guest[], AxiosError>({
    queryKey: ["guests"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/guests`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("_token")}`,
          },
        }
      );

      let data = [];
      if (res.data) {
        data = res.data;
      }

      setGuests(data);
      setGuestsToShow(data);

      return data;
    },
    retry: 0,
  });

  if (isError) {
    if (error.response?.status == 401) {
      sessionStorage.removeItem("_token");
      router.push("/login");
      return;
    }
  }

  return (
    <>
      <Head>
        <title>Wedding Presence</title>
      </Head>

      <main className="relative min-h-screen bg-white">
        <div className="p-3 space-y-4">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-700">Daftar tamu</h1>
            <label htmlFor="search" className="relative block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                <AiOutlineSearch />
              </span>
              <input
                type="text"
                className="py-1 pl-7 pr-2 w-full text-sm text-gray-500 bg-gray-100 rounded"
                placeholder="Search"
                onChange={(e) => {
                  if (e.target.value.length > 0) {
                    setGuestsToShow(
                      guests.filter((g) => {
                        return g.name
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase());
                      })
                    );
                  } else {
                    setGuestsToShow(guests);
                  }
                }}
              />
            </label>
          </header>

          <article className="text-gray-700">
            {isLoading && <small>Mengambil data...</small>}
            {!isLoading && (isError || guestsToShow.length == 0) ? (
              <small>Data tidak ditemukan</small>
            ) : (
              <ul className="space-y-2">
                {guestsToShow.map((guest) => (
                  <li
                    key={guest.id}
                    className="py-1 px-2 flex flex-row space-x-3 justify-between rounded bg-gray-200"
                  >
                    <Link
                      href={`/${guest.id}`}
                      className="flex-grow flex flex-col overflow-auto"
                    >
                      <p className="text-sm font-bold truncate">
                        {ucwords(guest.name)}
                      </p>
                      <small className="text-gray-500 truncate">
                        IDR {guest.money_gift.toLocaleString()}
                        {guest.adds_gift && ` | ${guest.adds_gift}`}
                      </small>
                    </Link>
                    <form
                      onSubmit={handleSubmit(() => {
                        deleteMutation.mutate(guest.id);
                      })}
                    >
                      <div className="flex h-full justify-center items-center">
                        <button className="bg-red-200 rounded p-3">
                          <AiOutlineUserDelete />
                        </button>
                      </div>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
        <BottomForm
          refetchFn={refetch}
          totalPerson={guests.length ? guests.length : 0}
        />
      </main>
    </>
  );
}
