import BottomForm from "@/components/BottomForm";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface Guest {
  id: number;
  name: string;
  money_gift: number;
  adds_gift: string;
}

const IndexPage: NextPage = () => {
  const router = useRouter();
  const [q, setQ] = useState("");

  const { isLoading, isError, data, error, refetch } = useQuery<
    Guest[],
    AxiosError
  >({
    queryKey: [],
    queryFn: async () => {
      const res = await axios.get(
        `http://172.31.26.210:1323/api/v1/guests${
          q.length > 0 ? "/name/" + q : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("_token")}`,
          },
        }
      );

      return res.data;
    },
    retry: 0,
  });

  if (isLoading) {
    return;
  }

  if (isError) {
    if (error.response?.status == 401) {
      sessionStorage.removeItem("_token");
      router.push("/login");
      return;
    }
  }

  if (!data) {
    return;
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
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                }}
                onBlur={(e) => {
                  refetch();
                }}
              />
            </label>
            {/* <form>
            </form> */}
          </header>
          <article className="text-gray-700">
            {isError ? (
              <small>Data tidak ditemukan</small>
            ) : (
              <ul className="space-y-2">
                {data.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/${item.id}`}
                      className="py-1 px-2 flex flex-col rounded bg-gray-200 whitespace-nowrap"
                    >
                      <p className="text-sm font-bold overflow-hidden text-ellipsis">
                        {item.name}
                      </p>
                      <small className="text-gray-500 overflow-hidden text-ellipsis">
                        IDR {item.money_gift}
                        {item.adds_gift && ` | ${item.adds_gift}`}
                      </small>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
        <BottomForm refetchFn={refetch} totalPerson={data.length} />
      </main>
    </>
  );
};

export default IndexPage;
