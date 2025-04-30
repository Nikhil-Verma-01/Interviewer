"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from "react";

// Define the FormType type that was missing
type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Define a submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      if (type === 'sign-up') {
        const { name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name as string, // Type assertion for name
          email,
          password,
        });

        if (!result?.succes) {
          toast.error(result?.message || "Sign up failed");
          return;
        }

        toast.success('Account created successfully. Please Sign in.');
        
        // Wait a little so toast can appear
        setTimeout(() => {
          router.replace('/sign-in');
        }, 1500);
        
      } else {
        const { email, password } = values;

        try {
          const userCredentials = await signInWithEmailAndPassword(auth, email, password);
          const idToken = await userCredentials.user.getIdToken();

          if (!idToken) {
            toast.error('Sign in failed. Please try again');
            return;
          }

          await signIn({ email, idToken });
          toast.success('Signed in successfully!');
          
          // Wait a little so toast can appear
          setTimeout(() => {
            router.replace('/');
          }, 1500);
        } catch (authError) {
          console.error("Authentication error:", authError);
          toast.error('Invalid email or password. Please try again.');
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(`There was an error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }

  const isSignIn = type === 'sign-in';

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <h3>Practice job interview with AI</h3>
      
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="w-full space-y-6 mt-6 form"
          >
            {!isSignIn && (
              <FormField 
                control={form.control} 
                name="name"
                label="Name" 
                placeholder="Your Name"
              />
            )}
            <FormField 
              control={form.control} 
              name="email"
              label="Email" 
              placeholder="Your Email Address"
              type="email"
            />
            <FormField 
              control={form.control} 
              name="password"
              label="Password" 
              placeholder="Enter your Password"
              type="password"
            />
            <Button 
              className="btn w-full" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (isSignIn ? 'Sign in' : 'Create an Account')}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? 'No account yet?' : 'Have account already?'}
          <Link 
            href={isSignIn ? '/sign-up' : '/sign-in'}
            className="font-bold text-user-primary ml-1"
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;