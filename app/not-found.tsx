"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import css from "./not-found.module.css";
import Image from "next/image";

import Link from "next/link";

const NotFound = () => {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 3000);
    return () => clearTimeout(timer);
  }, [router]);
  return (
    <div className={css.container}>
      <h1>404 - Page Not Found</h1>
      <Image src="/img-404.png" alt="Not Found" width={400} height={300} />
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href="/">Go back home</Link>
    </div>
  );
};

export default NotFound;
