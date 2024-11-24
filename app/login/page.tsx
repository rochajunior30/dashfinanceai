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
    <div className="grid h-full grid-cols-1 md:grid-cols-2">
      {/* ESQUERDA */}
      <div className="flex h-full flex-col items-center justify-center px-6 py-8 md:px-8">
        <Image
          src="/logo-500x100.png"
          width={400}
          height={300}
          alt="Finance AI"
          className="mb-6 md:mb-8"
        />
        <h1 className="mb-3 text-3xl font-bold text-center md:text-4xl">
          Bem-vindo
        </h1>
        <p className="mb-6 text-muted-foreground text-center md:mb-8">
          Somos uma plataforma de gestão financeira que combina inteligência artificial
          para monitorar suas movimentações, realizar lançamentos automatizados a partir de fotos
          e oferecer insights personalizados sobre seus gastos. 
          Simplifique o controle do seu orçamento e tome decisões mais inteligentes com facilidade.
        </p>
        <SignInButton>
          <Button variant="outline" className="w-full md:w-auto">
            <LogInIcon className="mr-2" />
            Fazer login ou criar conta
          </Button>
        </SignInButton>
      </div>

      {/* DIREITA */}
      <div className="relative hidden h-full w-full md:block">
        <VideoBackground />
      </div>
    </div>
  );
};

export default LoginPage;
