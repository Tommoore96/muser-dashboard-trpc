import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = "your_jwt_secret_here"; // Replace this with your own secret

export const authRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string(),
      })
    )
    .mutation(async (opts) => {
      // Implement your user creation logic here
      // You can use opts.input to access the input data
      // Example:
      const { email, name, password } = opts.input;

      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        throw new Error("User already exists.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
        },
      });

      // Sign and set JWT as a cookie
      const token = jwt.sign({ id: newUser.id }, JWT_SECRET, {
        expiresIn: "1d",
      });

      return { success: true, token };
    }),

  loginUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .query(async (opts) => {
      // Implement your user login logic here
      // You can use opts.input to access the input data
      // Example:
      // const loggedInUser = await loginUser(opts.input);
      // return loggedInUser;
    }),
});

export type AuthRouter = typeof authRouter;

// const userRouter = createRouter()
//   .mutation("register", {
//     input: z.object({
//       name: z.string(),
//       email: z.string().email(),
//       password: z.string(),
//     }),
//     async resolve({ input, ctx }) {
//       const existingUser = await prisma.user.findUnique({
//         where: { email: input.email },
//       });

//       if (existingUser) {
//         throw new Error("User already exists.");
//       }

//       const hashedPassword = await bcrypt.hash(input.password, 10);

//       const newUser = await prisma.user.create({
//         data: {
//           name: input.name,
//           email: input.email,
//           password: hashedPassword,
//         },
//       });

//       // Sign and set JWT as a cookie
//       const token = jwt.sign({ id: newUser.id }, JWT_SECRET, {
//         expiresIn: "1d",
//       });
//       ctx.res.setHeader(
//         "Set-Cookie",
//         cookie.serialize("token", token, { httpOnly: true, path: "/" })
//       );

//       return { success: true };
//     },
//   })
//   .mutation("login", {
//     input: z.object({
//       email: z.string().email(),
//       password: z.string(),
//     }),
//     async resolve({ input, ctx }) {
//       const user = await prisma.user.findUnique({
//         where: { email: input.email },
//       });

//       if (!user) {
//         throw new Error("Invalid email or password.");
//       }

//       const isPasswordValid = await bcrypt.compare(
//         input.password,
//         user.password
//       );

//       if (!isPasswordValid) {
//         throw new Error("Invalid email or password.");
//       }

//       // Sign and set JWT as a cookie
//       const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
//       ctx.res.setHeader(
//         "Set-Cookie",
//         cookie.serialize("token", token, { httpOnly: true, path: "/" })
//       );

//       return { success: true };
//     },
//   });

// export default userRouter;
