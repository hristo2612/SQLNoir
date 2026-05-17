import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrackedLink } from "@/components/TrackedLink";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "SQL para Iniciantes — Aprenda SQL do Zero em Português",
    description:
      "Guia de SQL para iniciantes em português. Aprenda SQL do zero: o que é, comandos básicos, como praticar. Comece resolvendo casos de detetive de graça.",
    alternates: { canonical: "/pt-br/sql-para-iniciantes" },
    openGraph: {
      type: "article",
      title:
        "SQL para Iniciantes — Aprenda SQL do Zero em Português | SQLNoir",
      description:
        "Guia de SQL para iniciantes em português. Aprenda SQL do zero: o que é, comandos básicos, como praticar. Comece resolvendo casos de detetive de graça.",
      url: "https://www.sqlnoir.com/pt-br/sql-para-iniciantes",
      images: [
        {
          url: "/open-graph-image.png",
          width: 1200,
          height: 630,
          alt: "SQL para Iniciantes — Aprenda SQL do Zero com SQLNoir",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "SQL para Iniciantes — Aprenda SQL do Zero em Português | SQLNoir",
      description:
        "Guia de SQL para iniciantes em português. Aprenda SQL do zero: o que é, comandos básicos, como praticar. Comece resolvendo casos de detetive de graça.",
      images: ["/open-graph-image.png"],
    },
  };
}

export function generateStaticParams() {
  return [{ locale: "pt-br" }];
}

export default async function SqlParaIniciantesPage() {
  const locale = await getLocale();
  if (locale !== "pt-br") notFound();

  const faqItems = [
    {
      question: "Qual a melhor forma de aprender SQL?",
      answer:
        "A melhor forma de aprender SQL é praticando com problemas reais, não só lendo teoria. Escreva consultas, veja o resultado e ajuste. No SQLNoir você faz isso resolvendo casos de detetive: cada consulta tem um objetivo claro e um retorno imediato.",
    },
    {
      question: "Quanto tempo para aprender SQL do zero?",
      answer:
        "Os comandos básicos de SQL (SELECT, WHERE, ORDER BY) podem ser aprendidos em poucos dias. Para ficar confortável com JOINs e agregações, conte de 3 a 6 semanas praticando um pouco por dia. Ganhar fluência de verdade vem com meses de uso constante.",
    },
    {
      question: "SQL é difícil de aprender?",
      answer:
        "Não. SQL é uma das linguagens mais acessíveis para quem está começando: a sintaxe é parecida com inglês e os primeiros resultados aparecem rápido. A parte que exige mais prática são os JOINs e as consultas com várias tabelas — mas isso vem naturalmente com repetição.",
    },
    {
      question: "SQL é gratuito?",
      answer:
        "Sim. SQL é um padrão aberto e os principais bancos de dados que o usam (PostgreSQL, MySQL, SQLite) são gratuitos. Você também pode praticar SQL de graça no navegador com o SQLNoir, sem instalar nada.",
    },
    {
      question: "Quais são os comandos básicos do SQL?",
      answer:
        "Os comandos básicos do SQL são SELECT (buscar dados), WHERE (filtrar), ORDER BY (ordenar), JOIN (cruzar tabelas) e GROUP BY com funções de agregação como COUNT e SUM (resumir dados). Dominando esses cinco você já resolve a maioria das consultas do dia a dia.",
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
            name: "SQL para Iniciantes",
            item: "https://www.sqlnoir.com/pt-br/sql-para-iniciantes",
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
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          <header className="space-y-5">
            <h1 className="font-detective text-4xl md:text-5xl text-amber-900 leading-tight">
              SQL para Iniciantes: Aprenda SQL do Zero
            </h1>
            <p className="text-amber-800 text-lg md:text-xl">
              SQL é a linguagem usada para conversar com bancos de dados:
              com ela você busca, filtra, cruza e resume informações
              guardadas em tabelas. É a forma padrão de fazer perguntas aos
              dados — e aprender SQL do zero é mais simples do que parece.
              Este guia mostra o que é SQL, os comandos básicos e como
              praticar até ganhar fluência.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <TrackedLink
                href="/cases"
                event="cta_click"
                eventProps={{
                  cta_id: "iniciantes-hero-start",
                  page: "/pt-br/sql-para-iniciantes",
                  source: "hero",
                }}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-50 font-detective text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Aprender SQL resolvendo casos
              </TrackedLink>
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="font-detective text-3xl text-amber-900">
              O que é SQL
            </h2>
            <p className="text-amber-800 leading-relaxed">
              SQL (Structured Query Language) é a linguagem padrão para
              trabalhar com bancos de dados relacionais. Um banco relacional
              guarda informações em tabelas — pense em planilhas com linhas e
              colunas. Cada tabela representa algo (clientes, pedidos,
              suspeitos de um crime) e o SQL é como você faz perguntas a
              esses dados: &quot;quais clientes compraram em março?&quot;,
              &quot;quem estava na cena do crime?&quot;.
            </p>
            <p className="text-amber-800 leading-relaxed">
              O que torna o SQL especial é que você descreve o que quer, não
              o passo a passo de como obter. Você diz &quot;me dê os nomes
              dos suspeitos sem álibi&quot; e o banco de dados resolve o
              resto. Por isso é uma ótima primeira linguagem: o foco está na
              lógica do problema, não em detalhes técnicos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-detective text-3xl text-amber-900">
              Por que aprender SQL
            </h2>
            <p className="text-amber-800 leading-relaxed">
              SQL é uma das habilidades mais pedidas do mercado de tecnologia
              e aparece muito além da área de dados. Desenvolvedores,
              analistas, profissionais de marketing, product managers e
              cientistas de dados usam SQL todos os dias. É uma linguagem
              estável — o que você aprende hoje continua valendo daqui a dez
              anos — e está presente em praticamente toda empresa que guarda
              dados.
            </p>
            <p className="text-amber-800 leading-relaxed">
              Para quem está começando na programação, SQL também é uma
              vitória rápida: você consegue resultados úteis nos primeiros
              dias, o que ajuda a manter a motivação.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-detective text-3xl text-amber-900">
              Os comandos básicos do SQL
            </h2>
            <p className="text-amber-800 leading-relaxed">
              Cinco comandos resolvem a maior parte das consultas do dia a
              dia. Domine estes e você já fala SQL:
            </p>
            <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-6 space-y-5">
              <div>
                <h3 className="font-detective text-xl text-amber-900">
                  SELECT — buscar dados
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  Escolhe quais colunas você quer ver.
                </p>
                <pre className="mt-2 bg-amber-950 text-amber-50 rounded-lg p-3 text-sm overflow-x-auto">
                  <code>SELECT nome, cidade FROM suspeitos;</code>
                </pre>
              </div>
              <div>
                <h3 className="font-detective text-xl text-amber-900">
                  WHERE — filtrar
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  Mantém só as linhas que atendem a uma condição.
                </p>
                <pre className="mt-2 bg-amber-950 text-amber-50 rounded-lg p-3 text-sm overflow-x-auto">
                  <code>
                    SELECT nome FROM suspeitos WHERE cidade = &apos;São
                    Paulo&apos;;
                  </code>
                </pre>
              </div>
              <div>
                <h3 className="font-detective text-xl text-amber-900">
                  ORDER BY — ordenar
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  Organiza os resultados em ordem crescente ou decrescente.
                </p>
                <pre className="mt-2 bg-amber-950 text-amber-50 rounded-lg p-3 text-sm overflow-x-auto">
                  <code>SELECT nome, idade FROM suspeitos ORDER BY idade DESC;</code>
                </pre>
              </div>
              <div>
                <h3 className="font-detective text-xl text-amber-900">
                  JOIN — cruzar tabelas
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  Combina dados de duas tabelas relacionadas.
                </p>
                <pre className="mt-2 bg-amber-950 text-amber-50 rounded-lg p-3 text-sm overflow-x-auto">
                  <code>
                    SELECT s.nome, a.local FROM suspeitos s JOIN alibis a ON
                    s.id = a.suspeito_id;
                  </code>
                </pre>
              </div>
              <div>
                <h3 className="font-detective text-xl text-amber-900">
                  GROUP BY e agregações — resumir dados
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  Agrupa linhas e calcula totais com COUNT, SUM ou AVG.
                </p>
                <pre className="mt-2 bg-amber-950 text-amber-50 rounded-lg p-3 text-sm overflow-x-auto">
                  <code>
                    SELECT cidade, COUNT(*) FROM suspeitos GROUP BY cidade;
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-detective text-3xl text-amber-900">
              Como aprender SQL do zero: um roteiro
            </h2>
            <p className="text-amber-800 leading-relaxed">
              Aprender SQL do zero funciona melhor em etapas curtas e
              práticas. Um roteiro que funciona:
            </p>
            <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-6 space-y-3">
              <p className="text-amber-800 leading-relaxed">
                <span className="font-detective text-amber-900">
                  1. Entenda o modelo de tabelas
                </span>{" "}
                — saiba o que são linhas, colunas e a relação entre tabelas.
              </p>
              <p className="text-amber-800 leading-relaxed">
                <span className="font-detective text-amber-900">
                  2. Domine SELECT e WHERE
                </span>{" "}
                — pratique buscar e filtrar até virar automático.
              </p>
              <p className="text-amber-800 leading-relaxed">
                <span className="font-detective text-amber-900">
                  3. Aprenda ORDER BY e LIMIT
                </span>{" "}
                — controle a ordem e a quantidade dos resultados.
              </p>
              <p className="text-amber-800 leading-relaxed">
                <span className="font-detective text-amber-900">
                  4. Avance para JOINs
                </span>{" "}
                — o passo que mais separa iniciante de intermediário.
              </p>
              <p className="text-amber-800 leading-relaxed">
                <span className="font-detective text-amber-900">
                  5. Pratique agregações
                </span>{" "}
                — GROUP BY, COUNT, SUM, AVG para análises reais.
              </p>
              <p className="text-amber-800 leading-relaxed">
                <span className="font-detective text-amber-900">
                  6. Resolva problemas de verdade
                </span>{" "}
                — aplique tudo em casos com dados reais, não só exercícios
                isolados.
              </p>
            </div>
            <p className="text-amber-800 leading-relaxed">
              O erro mais comum de quem aprende SQL do zero é estudar só
              teoria. Escreva consultas desde o primeiro dia — é praticando
              que o conhecimento fixa.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-detective text-3xl text-amber-900">
              Praticar SQL com casos reais
            </h2>
            <p className="text-amber-800 leading-relaxed">
              O SQLNoir foi feito exatamente para a etapa de prática. Em vez
              de listas de exercícios secas, você assume o papel de detetive
              e resolve crimes consultando bancos de dados reais. Cada caso
              te dá um objetivo claro — descobrir o culpado — e você só
              avança quando a sua consulta retorna a pista certa.
            </p>
            <p className="text-amber-800 leading-relaxed">
              A dificuldade vai do iniciante ao avançado, então dá para
              começar do absoluto zero. Tudo roda no navegador, todos os
              casos são gratuitos e não exigem cadastro. É a forma mais
              divertida de aprender SQL na prática.
            </p>
          </section>

          <section className="bg-amber-100/60 border border-amber-200 rounded-2xl p-8 text-center space-y-4">
            <h2 className="font-detective text-3xl text-amber-900">
              Comece a aprender SQL agora
            </h2>
            <p className="text-amber-800 leading-relaxed max-w-xl mx-auto">
              Aprenda SQL do zero resolvendo o seu primeiro caso de detetive.
              Grátis, no navegador, sem cadastro.
            </p>
            <div className="flex justify-center pt-2">
              <TrackedLink
                href="/cases"
                event="cta_click"
                eventProps={{
                  cta_id: "iniciantes-footer-cta",
                  page: "/pt-br/sql-para-iniciantes",
                  source: "footer-cta",
                }}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-amber-900 text-amber-50 font-detective text-lg transition-colors duration-200 hover:bg-amber-800 shadow-md"
              >
                Resolver meu primeiro caso
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
        </article>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
