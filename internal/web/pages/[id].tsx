import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";

interface Guest {
  id: number;
  name: string;
  money_gift: number;
  adds_gift: string;
}

const GuestById: NextPage = () => {
  const router = useRouter();

  const { isLoading, isError, data, error } = useQuery<Guest, AxiosError>({
    queryKey: [`guest_${router.query.id}`],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:1323/api/v1/guests/${router.query.id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("_token")}`,
          },
        }
      );

      return res.data;
    },
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

    return <h1>Something bad happened.</h1>;
  }

  return (
    // <div>
    //   <h1>By page</h1>
    //   <p>Nama {props.guest.name}</p>
    // </div>
    <main className="relative min-h-screen bg-white text-gray-700">
      <div className="p-3 space-y-4">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">{data.name}</h1>
          <p className="font-bold">IDR {data.money_gift.toLocaleString()}</p>
        </header>
        <article className="text-sm text-gray-500">
          <small>Note:</small>
          <br />
          {data.adds_gift.length > 0 ? data.adds_gift : "..."}
        </article>
      </div>
    </main>
  );
};

export default GuestById;
