import AuthForm from '@/components/AuthForm'
import { isAuthenticated } from '@/lib/constant/auth.action'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async() => {
  const isAuth = await isAuthenticated();

  if(isAuth) redirect("/");

  return (
    
    <AuthForm type="sign-in"/>

    
  )
}

export default page