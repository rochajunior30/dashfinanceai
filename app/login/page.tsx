import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import VideoBackground from "../_components/bg-login";

const LoginPage = async () => {
  const { userId } = await auth();
  if (userId) {  
    redirect("/");
  }
  return (
    <div className="grid h-full grid-cols-2">
      {/* ESQUERDA */}
      <div className="mx-auto flex h-full max-w-[550px] flex-col justify-center p-8">
        <Image
          src="/logo.png"
          width={350}
          height={300}
          alt="Finance AI"
          className="mb-8"
        />
        <h1 className="mb-3 text-4xl font-bold">Bem-vindo</h1>
        <p className="mb-8 text-muted-foreground">
        Somos uma plataforma de gestão financeira que combina inteligência artificial
        para monitorar suas movimentações, realizar lançamentos automatizados a partir de fotos
        e oferecer insights personalizados sobre seus gastos. 
        Simplifique o controle do seu orçamento e tome decisões mais inteligentes com facilidade.
        </p>
        <SignInButton>
          <Button variant="outline">
            <LogInIcon className="mr-2" />
            Fazer login ou criar conta
          </Button>
        </SignInButton>
      </div>
      {/* DIREITA */}
      <div className="relative h-full w-full">
        <VideoBackground/>
      </div>
    </div>
  );
};

export default LoginPage;
