"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSignIn } from "@/components/providers/SignInProvider";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  description: string;
  link: string;
  linkTitle: string;
}

const PROTECTED = ["/ask-question", "/clb/create"];

const NoResult = ({ title, description, link, linkTitle }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { openSignIn } = useSignIn();

  const handleClick = () => {
    if (PROTECTED.includes(link) && !session) { openSignIn(); return; }
    router.push(link);
  };

  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center">
      <Image src="/assets/images/light-illustration.png" alt="No result" width={270} height={200} className="block object-contain dark:hidden" />
      <Image src="/assets/images/dark-illustration.png" alt="No result" width={270} height={200} className="hidden object-contain dark:flex" />
      <h2 className="h2-bold text-dark200_light900 mt-6">{title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">{description}</p>
      <Button onClick={handleClick} className="paragraph-medium mt-3 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900">
        {linkTitle}
      </Button>
    </div>
  );
};

export default NoResult;
