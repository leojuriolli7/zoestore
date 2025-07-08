import { Header } from "@/components/Header";

export default function PublicAppLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />
      {children}
    </div>
  );
}
