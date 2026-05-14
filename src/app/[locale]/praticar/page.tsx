import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrackedLink } from "@/components/TrackedLink";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Praticar SQL Online Grátis — Casos Reais no Navegador",
    description:
      "Pratique SQL online no navegador. Casos de detetive reais para resolver com SELECT, JOIN e WHERE. Comece a praticar sem instalar nada, sem cadastro.",
    alternates: { canonical: "/pt-br/praticar" },
    openGraph: {
      type: "website",
      title:
        "Praticar SQL Online Grátis — Casos Reais no Navegador | SQLNoir",
      description:
        "Pratique SQL online no navegador. Casos de detetive reais para resolver com SELECT, JOIN e WHERE. Comece a praticar sem instalar nada, sem cadastro.",
      url: "https://www.sqlnoir.com/pt-br/praticar",
      images: [
        {
          url: "/open-graph-image.png",
          width: 1200,
          height: 630,
          alt: "Praticar SQL Online Grátis com SQLNoir",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Praticar SQL Online Grátis — Casos Reais no Navegador | SQLNoir",
      description:
        "Pratique SQL online no navegador. Casos de detetive reais para resolver com SELECT, JOIN e WHERE. Comece a praticar sem instalar nada, sem cadastro.",
      images: ["/open-graph-image.png"],
    },
  };
}

export function generateStaticParams() {
  return [{ locale: "pt-br" }];
}

export default async function PraticarPage() {
  const locale = await getLocale();
  if (locale !== "pt-br") notFound();

  const faqItems = [
    {
      question: "Preciso instalar algo para praticar SQL?",
      answer:
        "Não. O SQLNoir roda inteiro no navegador. Você abre um caso e já começa a escrever consultas SQL — sem instalar banco de dados, sem configurar ambiente, sem download.",
    },
    {
      question: "Praticar SQL no SQLNoir é grátis?",
      answer:
        "Sim. Os primeiros casos são totalmente gratuitos e não exigem cadastro. Você pode praticar SELECT, WHERE e JOIN de graça, direto no navegador.",
    },
    {
      question: "O que dá para praticar no SQLNoir?",
      answer:
        "Você pratica os comandos que aparecem no dia a dia de quem trabalha com dados: SELECT para buscar informações, WHERE para filtrar, JOIN para cruzar tabelas e funções de agregação como COUNT e SUM para resumir resultados.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Início",
            item: "https://www.sqlnoir.com/pt-br",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Praticar SQL",
            item: "https://www.sqlnoir.com/pt-br/praticar",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Navbar
        title="SQLNoir"
        titleHref="/"
        links={[
          { label: "Início", href: "/", activeMatch: "/" },
          { label: "Casos", href: "/cases", activeMatch: "/cases" },
          { label: "Ajuda", href: "/help", activeMatch: "/help" },
        ]}
        showShare
      />
      <main className="min-h-screen bg-amber-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          <header className="space-y-5">
            <h1 className="font-detective text-4xl md:text-5xl text-amber-900 leading-tight">
              Praticar SQL Online — Grátis e no Navegador
            </h1>
            <p className="text-amber-800 text-lg md:text-xl">
              Pare de decorar comandos. No SQLNoir você pratica SQL online
              resolvendo casos de detetive de verdade: cada consulta que você
              escreve revela uma pista e te aproxima de fechar o caso. É
              prática de SQL com propósito — direto no navegador, sem instalar
              nada e sem cadastro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <TrackedLink
                href="/cases"
                event="cta_click"
                eventProps={{
                  cta_id: "praticar-hero-start",
                  page: "/pt-br/praticar",
                  source: "hero",
                }}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-50 font-detective text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Começar a praticar agora
              </TrackedLink>
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="font-detective text-3xl text-amber-900">
              Pratique SQL resolvendo casos de detetive
            </h2>
            <p className="text-amber-800 leading-relaxed">
              Cada caso do SQLNoir é um mistério com um banco de dados real por
              trás: registros de suspeitos, álibis, transações, testemunhas.
              Para descobrir o culpado, você precisa interrogar esses dados com
              SQL. Não existe botão de &quot;próximo&quot; — você só avança
              quando a sua consulta retorna a informação certa.
            </p>
            <p className="text-amber-800 leading-relaxed">
              Esse formato transforma a prática em algo que gruda: você não
              está repetindo exercícios soltos, está investigando. E é assim
              que o SQL realmente se aprende — usando para resolver um
              problema concreto.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-detective text-3xl text-amber-900">
              O que você pratica nos exercícios de SQL
            </h2>
            <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-6 space-y-3">
              <p className="text-amber-800 leading-relaxed">
                <span className="font-detective text-amber-900">SELECT</span> —
                buscar e exibir exatamente os dados que importam para o caso.
              </p>
              <p className="text-amber-800 leading-relaxed">
                <span className="font-detective text-amber-900">WHERE</span> —
                filtrar suspeitos, datas e locais para isolar a pista certa.
              </p>
              <p className="text-amber-800 leading-relaxed">
                <span className="font-detective text-amber-900">JOIN</span> —
                cruzar várias tabelas para conectar pessoas, eventos e provas.
              </p>
              <p className="text-amber-800 leading-relaxed">
                <span className="font-detective text-amber-900">
                  Agregações
                </span>{" "}
                — usar COUNT, SUM, AVG e GROUP BY para encontrar padrões
                escondidos nos dados.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-detective text-3xl text-amber-900">
              Por que é melhor que listas de exercícios secas
            </h2>
            <p className="text-amber-800 leading-relaxed">
              Listas tradicionais de exercícios de SQL te dão uma tarefa
              artificial e uma resposta. Você resolve, esquece e passa para a
              próxima. No SQLNoir cada consulta tem consequência narrativa: o
              resultado é uma pista, e a pista move a história. Isso mantém
              você engajado por muito mais tempo — e a repetição com contexto é
              o que fixa o conhecimento.
            </p>
            <p className="text-amber-800 leading-relaxed">
              A dificuldade também cresce de forma natural, do iniciante ao
              avançado, então você sempre está praticando no limite certo: nem
              fácil demais, nem impossível.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-detective text-3xl text-amber-900">
              SQL online grátis: sem instalar, sem cadastro
            </h2>
            <p className="text-amber-800 leading-relaxed">
              Você não precisa de PostgreSQL, MySQL nem de nenhum cliente de
              banco de dados instalado. O SQLNoir roda 100% no navegador: abra
              um caso e o editor de SQL já está pronto, com o banco carregado.
              Os primeiros casos são gratuitos e não pedem cadastro — dá para
              praticar SQL online de graça agora mesmo.
            </p>
          </section>

          <section className="bg-amber-100/60 border border-amber-200 rounded-2xl p-8 text-center space-y-4">
            <h2 className="font-detective text-3xl text-amber-900">
              Pronto para praticar?
            </h2>
            <p className="text-amber-800 leading-relaxed max-w-xl mx-auto">
              Escolha o seu primeiro caso e comece a escrever consultas SQL de
              verdade. Sem instalação, sem cadastro, de graça.
            </p>
            <div className="flex justify-center pt-2">
              <TrackedLink
                href="/cases"
                event="cta_click"
                eventProps={{
                  cta_id: "praticar-footer-cta",
                  page: "/pt-br/praticar",
                  source: "footer-cta",
                }}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-amber-900 text-amber-50 font-detective text-lg transition-colors duration-200 hover:bg-amber-800 shadow-md"
              >
                Ver os casos e praticar SQL
              </TrackedLink>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-detective text-3xl text-amber-900">
              Perguntas frequentes
            </h2>
            <div className="grid gap-4">
              {faqItems.map((item) => (
                <div
                  key={item.question}
                  className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 space-y-2"
                >
                  <h3 className="font-detective text-xl text-amber-900">
                    {item.question}
                  </h3>
                  <p className="text-amber-800 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
