import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SignUpForm, signUpSchema } from "~/server/validation";
import { api } from "~/utils/api";

const SignUp: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutateAsync } = api.auth.signUp.useMutation();

  const onSubmit = useCallback(
    async (data: SignUpForm) => {
      const result = await mutateAsync(data);
      if (result.status === 201) {
        void router.push("/");
      }
    },
    [mutateAsync, router]
  );

  return (
    <div>
      <Head>
        <title>Next App - Register</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <form
          className="flex h-screen w-full items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-96 rounded-lg bg-white shadow-xl">
            <div className="p-8">
              <h2 className="mb-6 text-2xl font-bold">Create an account!</h2>
              <input
                type="text"
                placeholder="Type your name..."
                className="input input-bordered mb-4 w-full"
                {...register("name")}
              />
              <input
                type="email"
                placeholder="Type your email..."
                className="input input-bordered mb-4 w-full"
                {...register("email")}
              />
              <input
                type="password"
                placeholder="Type your password..."
                className="input input-bordered mb-6 w-full"
                {...register("password")}
              />
              <div className="flex items-center justify-between">
                <Link href="/">
                  <a className="cursor-pointer text-blue-600 hover:underline">
                    Go to login
                  </a>
                </Link>
                <button
                  className="rounded bg-blue-600 px-4 py-2 text-white shadow"
                  type="submit"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SignUp;